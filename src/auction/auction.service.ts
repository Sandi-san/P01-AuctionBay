import { Injectable } from '@nestjs/common';
import { BidService } from 'src/bid/bid.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuctionService {
    //POVEZAVA Z REPOSITORY
    constructor(
        private prisma: PrismaService,
        private bidService: BidService
    ) { }

    //DOBI VSE AUCTIONE OD VSEH USERJEV
    async getAll(){
        return 'TODO: getting all auctions'
    }

    //DOBI EN AUCTION
    async getById(){
        return 'TODO: getting one auction'
    }

    //BIDDAJ NA EN AUCTION
    async bidOnId(){
        return this.bidService.create()
    }

    
    //DOBI VSE AUCTIONE OD USERJA
    async getAllForUser() {
        return 'TODO: getting all auctions for user';
    }

    //USTAVARI NOV AUCTION
    async create() {
        return 'TODO: creating new auction';
    }

    //UPDATE AUCTION
    async edit() {
        return 'TODO: editing auction';
    }

    async getBids(){
        return this.bidService.getAllForAuction()
    }
}
