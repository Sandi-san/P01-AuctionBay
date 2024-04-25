import { BadRequestException, Injectable } from '@nestjs/common';
import { Bid } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateBidDto } from './dto/create-bid.dto';

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

    //SPREMENI/DOBI STATUS BIDA GLEDE OSTALE (WINNING, OUTBID,...)
    async getBidStatus(){

    }

    //BIDDAJ NA EN AUCTION
    async create(
        auctionId: number,
        dto: CreateBidDto,
        userId: number
    ): Promise<Bid> {

        //dodaj foreign key-e
        dto = {
            ...dto,
            status: "In progress",
            userId: userId,
            auctionId: auctionId
        }

        try {
            const createdBid = await this.prisma.bid.create({
                data: {
                    ...dto
                }
            })
            return createdBid;
        } catch (error) {
            console.log(error)
            throw new BadRequestException('Something went wrong while creating new bid!')
        }
    }

    //DOBI AVATAR IMAGE OD USERJA ZA DISPLAY
    async getUserAvatar() {
        return 'TODO: getting user avatar image'
    }
}
