import { BadRequestException, Injectable } from '@nestjs/common';
import { BidService } from 'src/bid/bid.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateAuctionDto } from './dto';
import { Auction } from '@prisma/client';

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

    //PAGINATE

    //DOBI EN AUCTION
    async getById(
        id: number
    ){
        return 'TODO: getting one auction'
    }

    //BIDDAJ NA EN AUCTION
    async bidOnId(
        auctionId: number
    ){
        return this.bidService.create()
    }

    
    //DOBI VSE AUCTIONE OD USERJA
    async getAllForUser(
        userId: number
    ) {
        return 'TODO: getting all auctions for user';
    }

    //USTAVARI NOV AUCTION
    async create(
        dto: CreateAuctionDto
    ): Promise<Auction> {
        console.log(dto)
        try {
            const createdAuction = await this.prisma.auction.create({
                data: {
                    ...dto,
                }
            })
            return createdAuction;
        } catch (error) {
            console.log(error)
            throw new BadRequestException('Something went wrong while creating new auction!')
        }
    }

    //UPDATE AUCTION
    async edit() {
        return 'TODO: editing auction';
    }

    async getBids(){
        return this.bidService.getAllForAuction()
    }
}
