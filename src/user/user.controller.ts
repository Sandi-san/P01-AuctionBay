import { Controller, Get, HttpCode, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard';

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
    async getMe(@GetUser() user: User): Promise<User> {
        //dobi info userja glede trenutni access token
        return user
    }

    //SPREMENI PASSWORD OD USERJA
    @HttpCode(HttpStatus.CREATED)
    @Post('upload-image')
    async uploadAvatar() {
        return this.userService.updateUserImage()
    }

    //SPREMENI USER INFO (NE PASSWORD)
    @HttpCode(HttpStatus.OK)
    @Patch('edit')
    async editUser() {
        return this.userService.update()
    }

    //SPREMENI (SAMO) PASSWORD OD USERJA
    @HttpCode(HttpStatus.OK)
    @Patch('update-password')
    async editPassword() {
        return this.userService.changePassword()
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
    async createAuction() {
        //async getAuctions(): Promise<Auction> {
        return this.userService.createUserAuction()
    }

    //USTVARI AUCTION
    @HttpCode(HttpStatus.OK)
    @Patch('auction/:id')
    async editAuction() {
        //async getAuctions(): Promise<Auction> {
        return this.userService.editUserAuction()
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
