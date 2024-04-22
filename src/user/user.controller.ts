import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Auction, User } from '@prisma/client';
import { GetLoggedUser } from 'src/auth/decorator';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { UpdateUserDto } from './dto/update-user.dto';
import { isFileExtensionSafe, removeFile, saveImageToStorage } from 'src/helpers/image-storage.helper';
import { CreateAuctionDto, UpdateAuctionDto } from 'src/auction/dto';

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
    async getMe(@GetLoggedUser() user: User): Promise<User> {
        //dobi info userja glede trenutni access_token
        return user
    }

    //SPREMENI PASSWORD OD USERJA
    @HttpCode(HttpStatus.CREATED)
    @Post('upload-image')
    @UseInterceptors(FileInterceptor('image', saveImageToStorage))
    async uploadAvatar(
        @GetLoggedUser() user: User,
        @UploadedFile() file: Express.Multer.File
    ): Promise<User> {
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


    //DOBI VSE AUCTIONE OD USERJA
    @HttpCode(HttpStatus.OK)
    @Get('auctions')
    async getAuctions() {
        //async getAuctions(): Promise<Auction[]> {
        return this.userService.getUserAuctions()
    }

    //USTVARI AUCTION
    @HttpCode(HttpStatus.CREATED)
    @Post('auction')
    async createAuction(
        @GetLoggedUser() user: User,
        @Body() dto: CreateAuctionDto
    ): Promise<Auction> {
        return this.userService.createUserAuction(user.id, dto)
    }


    //USTVARI AUCTION
    @HttpCode(HttpStatus.OK)
    @Patch('auction/:id')
    async editAuction(
        @Param('id') id: string,
        @Body() dto: UpdateAuctionDto,
    ): Promise<Auction> {
        try {
            const auctionId = parseInt(id, 10)
            if (isNaN(auctionId)) {
                throw new BadRequestException('Invalid ID');
            }
            return this.userService.editUserAuction(auctionId, dto)
        } catch (error) {
            console.log(error)
            throw new BadRequestException('Invalid ID');
        }
    }

    //DOBI VSE BIDE OD USERJA
    @HttpCode(HttpStatus.OK)
    @Get('bids')
    async getBids() {
        //async getBids(): Promise<Bid[]> {
        return this.userService.getUserBids()
    }

    //USTVARI NOV AUCTION
    @HttpCode(HttpStatus.OK)
    @Get('bids/won')
    async getBidsWon() {
        //async getBidsWon(): Promise<Bid[]> {
        return this.userService.getUserBidsWon()
    }
}
