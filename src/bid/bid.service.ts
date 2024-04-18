import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class BidService {
    //POVEZAVA Z REPOSITORY
    constructor(private prisma: PrismaService) { }

    //DOBI VSE BIDE KI JE USER USTVARIL
    async getAllForUser() {
        return 'TODO: getting all user\'s bids';
    }

    //DOBI VSE BIDE S KATERIMI JE USER ZMAGAL
    async getAllWonForUser() {
        return 'TODO: getting all won user\'s bids';
    }

    //DOBI VSE BIDDE OD AUCTIONA
    async getAllForAuction() {
        return 'TODO: getting all bids of auction'
    }

    //BIDDAJ NA EN AUCTION
    async create() {
        return 'TODO: creating bid on auction'
    }

    //DOBI AVATAR IMAGE OD USERJA ZA DISPLAY
    async getUserAvatar() {
        return 'TODO: getting user avatar image'
    }
}
