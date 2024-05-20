import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Auction, Bid, User } from '@prisma/client';
import { GetLoggedUser } from 'src/auth/decorator';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { UpdateUserDto } from './dto/update-user.dto';
import { isFileExtensionSafe, removeFile, saveImageToStorage } from 'src/helpers/image-storage.helper';
import { CreateAuctionDto, UpdateAuctionDto } from 'src/auction/dto';
import { PaginatedResult } from 'src/interfaces/paginated-result.interface';

//nastavi dostop do route: users/... z UseGuards (restricta VSE route v tem fileu)
@UseGuards(JwtGuard)
@Controller('me')
export class UserController {
    constructor(private userService: UserService) { }

    //DOBI CURRENT LOGGED USER
    @HttpCode(HttpStatus.OK)
    //PROTECT ROUTE Z JWT-PASSPORT GUARDOM (glej auth/strategy/jwt.strategy)
    //default: 'jwt', 'jwt-refresh' za refresh token
    //@UseGuards(JwtGuard)
    @Get('')
    //dobi posamezni var z @GetUser('email') email: string
    async getMe(
        @GetLoggedUser() user: User
    ): Promise<User> {
        //dobi info userja glede trenutni access_token
        return user
    }

    //SPREMENI AVATAR IMAGE OD USERJA
    @HttpCode(HttpStatus.CREATED)
    @Post('upload-image')
    @UseInterceptors(FileInterceptor('image', saveImageToStorage))
    async uploadAvatar(
        @GetLoggedUser() user: User,
        @UploadedFile() file: Express.Multer.File
    ): Promise<User> {
        console.log(file, user.id)
        const filename = file?.filename
        if (!filename) throw new BadRequestException('File must be of type png, jpg or jpeg!')
        const imagesFolderPath = join(process.cwd(), 'files')
        const fullImagePath = join(imagesFolderPath + '/' + file.filename)
        //preveri ce je image file veljaven in sele nato update-aj
        if (await isFileExtensionSafe(fullImagePath)) {
            return this.userService.updateUserImage(user.id, filename)
        }
        removeFile(fullImagePath)
        throw new BadRequestException('File is corrupted!')
    }

    //SPREMENI USER INFO (NE PASSWORD)
    @HttpCode(HttpStatus.OK)
    @Patch('edit')
    async editUser(
        @GetLoggedUser() user: User,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<User> {
        return this.userService.update(user.id, updateUserDto)
    }

    //SPREMENI (SAMO) PASSWORD OD USERJA
    @HttpCode(HttpStatus.OK)
    @Patch('update-password')
    async editPassword(
        @GetLoggedUser() user: User,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<{ response: string }> {
        return this.userService.changePassword(user.id, updateUserDto)
    }

    //USTVARI AUCTION
    @HttpCode(HttpStatus.CREATED)
    @Post('auction')
    async createAuction(
        @GetLoggedUser() user: User,
        @Body() dto: CreateAuctionDto,
    ): Promise<Auction> {
        return this.userService.createUserAuction(user.id, dto)
    }

    //UPDATE AUCTION
    @HttpCode(HttpStatus.OK)
    @Patch('auction/:id')
    async editAuction(
        @Param('id') id: string,
        @Body() dto: UpdateAuctionDto,
    ): Promise<Auction> {
        //parsaj string iz url v int
        const auctionId = parseInt(id, 10)
        if (isNaN(auctionId)) {
            throw new BadRequestException('Invalid ID');
        }
        return this.userService.editUserAuction(auctionId, dto)
    }

    //SPREMENI FILE (SLIKO) OD AUCTIONA
    //mora biti posebej, ker ne mores istocasno poslat dto in file v frontendu
    @HttpCode(HttpStatus.OK)
    @Post('auction/:id/upload-image')
    @UseInterceptors(FileInterceptor('image', saveImageToStorage))
    async uploadAuctionImage(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File
    ): Promise<Auction> {
        console.log("Id:",id)
        console.log("File:",file)

        //parsaj string iz url v int
        const auctionId = parseInt(id, 10)
        if (isNaN(auctionId)) {
            throw new BadRequestException('Invalid ID');
        }
        //ce je podan image file, shrani img v files in dodaj filename v dto.image
        if (file) {
            const filename = file?.filename
            if (!filename) throw new BadRequestException('File must be of type png, jpg or jpeg!')
            const imagesFolderPath = join(process.cwd(), 'files')
            const fullImagePath = join(imagesFolderPath + '/' + file.filename)
            //preveri ce je image file veljaven in sele nato update-aj
            if (await isFileExtensionSafe(fullImagePath)) {
                return this.userService.uploadAuctionImage(auctionId, filename)
            }
            else {
                removeFile(fullImagePath)
                throw new BadRequestException('File is corrupted!')
            }
            //FINE-TUNE: zbrisi old file
            //dobi previous filename iz auctiona in deletaj file z istim imenom (ce obstaja)
            const auction = this.userService.getUserAuction(auctionId)
            if (auction && (await auction).image) {
                const fullImagePathToDelete = join(imagesFolderPath + '/' + (await auction).image)
                removeFile(fullImagePathToDelete)
            }
        }
    }

    //DOBI VSE BIDE OD USERJA
    @HttpCode(HttpStatus.OK)
    @Get('bids')
    async getBids(
        @GetLoggedUser() user: User,
    ): Promise<Bid[]> {
        return this.userService.getUserBids(user.id)
    }

    //DOBI VSE AUCTIONE OD USERJA
    @HttpCode(HttpStatus.OK)
    @Get('auctions')
    async getAuctions(
        @GetLoggedUser() user: User,
        @Query('page') page: number
    ): Promise<PaginatedResult> {
        return this.userService.getUserAuctions(user.id, page)
    }

    //DOBI VSE WON AUCTIONE OD USERJA
    @HttpCode(HttpStatus.OK)
    @Get('auctions/won')
    async getAuctionsWon(
        @GetLoggedUser() user: User,
        @Query('page') page: number
    ): Promise<PaginatedResult> {
        return this.userService.getUserAuctionsWon(user.id,page)
    }

    //DOBI VSE AUCTIONE KJER USER BIDDA
    @HttpCode(HttpStatus.OK)
    @Get('auctions/bidding')
    async getAuctionsBidding(
        @GetLoggedUser() user: User,
        @Query('page') page: number
    ): Promise<PaginatedResult> {
        return this.userService.getUserAuctionsBidding(user.id,page)
    }
}
