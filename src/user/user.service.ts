import { Injectable } from '@nestjs/common';
import { AuctionService } from 'src/auction/auction.service';
import { BidService } from 'src/bid/bid.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    //POVEZAVA Z REPOSITORY
    constructor(
        private prisma: PrismaService,
        private auctionService: AuctionService,
        private bidService: BidService
    ) { }

    //SPREMENI AVATAR SLIKO
    async updateUserImage() {
        return 'TODO: uploading new avatar';
    }

    //UPDATE USER INFO
    async update() {
        return 'TODO: editing user';
    }

    //UPDATE USER PASSWORD
    async changePassword() {
        return 'TODO: updating password';
    }

    //DOBI VSE POSTANE AUCTIONE OD USERJA
    async getUserAuctions() {
        return this.auctionService.getAllForUser()
    }

    //USTAVARI NOV AUCTION
    async createUserAuction() {
        return this.auctionService.create()
    }

    //UPDATE AUCTION
    async editUserAuction() {
        return this.auctionService.edit()
    }

    //DOBI VSE BIDE KI JE USER USTVARIL
    async getUserBids(){
        return this.bidService.getAllForUser()
    }

    //DOBI VSE BIDE S KATERIMI JE USER ZMAGAL
    async getUserBidsWon(){
        return this.bidService.getAllWonForUser()
    }
}
