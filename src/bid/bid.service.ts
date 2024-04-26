import { BadRequestException, Injectable } from '@nestjs/common';
import { Bid } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBidDto } from './dto/create-bid.dto';

@Injectable()
export class BidService {
    //POVEZAVA Z REPOSITORY
    constructor(private prisma: PrismaService) { }

    //DOBI VSE BIDE OD USER-JA
    //userId, status: 1-all bids, 0-only won bids
    async getAllForUser(
        userId: number,
        status: boolean
    ): Promise<Bid[]> {
        //get all user bids
        if (status) {
            try {
                const bids = await this.prisma.bid.findMany({
                    where: { userId }
                })
                return bids
            } catch (error) {
                console.error(error)
                throw new BadRequestException(`Something went wrong while getting bids for user with id ${userId}!`)
            }
        }
        //get Won user bids
        else {
            try {
                const bids = await this.prisma.bid.findMany({
                    where: { 
                        userId,
                        OR: [
                            { status: "Won" },
                            { status: "Winning" }
                        ]
                    }
                })
                return bids
            } catch (error) {
                console.error(error)
                throw new BadRequestException(`Something went wrong while getting bids for user with id ${userId}!`)
            }
        }
    }

    //DOBI VSE BIDDE OD AUCTIONA
    async getAllForAuction(
        auctionId: number
    ): Promise<Bid[]> {
        try {
            const bids = await this.prisma.bid.findMany({
                where: { auctionId }
            })
            return bids
        } catch (error) {
            console.error(error)
            throw new BadRequestException(`Something went wrong while getting bids for auction with id ${auctionId}!`)
        }
    }

    //SPREMENI STATUS VSEH OSTALIH BIDOV KO SE POSTA NOV (Winning->In progress?)
    async changeBidsStatus() {
        return 'TODO: changing other bids'
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
            status: "In progress", //Winning?
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
