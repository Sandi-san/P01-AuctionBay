import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { BidService } from 'src/bid/bid.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAuctionDto, UpdateAuctionDto } from './dto';
import { Auction, Bid } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateBidDto } from 'src/bid/dto/create-bid.dto';

@Injectable()
export class AuctionService {
    //POVEZAVA Z REPOSITORY
    constructor(
        private prisma: PrismaService,
        private bidService: BidService
    ) { }

    //DOBI VSE AUCTIONE OD VSEH USERJEV
    async getAll() {
        return 'TODO: getting all auctions'
    }

    //PAGINATE

    //DOBI EN AUCTION
    async getById(
        id: number
    ): Promise<Auction> {
        try {
            const auction = await this.prisma.auction.findUnique({
                where: { id }
            });

            if (!auction) throw new NotFoundException(`Auction with id \'${id}\' does not exist!`)

            return auction;
        } catch (error) {
            console.log(error)
            throw error
            // throw new BadRequestException('Something went wrong while getting auction!')
        }
    }

    //DOBI VSE AUCTIONE OD USERJA
    async getAllForUser(
        userId: number
    ): Promise<Auction[]> {
        try {
            const auctions = await this.prisma.auction.findMany({
                where: { userId }
            })
            return auctions
        } catch (error) {
            console.error(error)
            throw new BadRequestException(`Something went wrong while getting auctions from user with id ${userId}!`)
        }
    }

    //USTAVARI NOV AUCTION
    async create(
        userId: number,
        dto: CreateAuctionDto
    ): Promise<Auction> {
        //console.log(dto)

        //CAS MORA BITI V PRIHODNOSTI
        if (Date.now() > new Date(dto.duration).getTime()) {
            console.log('Date invalid!')
            throw new ForbiddenException('Date must be valid!');
        }

        //spremeni duration iz string v Date (ker posiljamo json)
        dto = {
            ...dto,
            userId: userId,
            duration: new Date(dto.duration)
        }

        try {
            const createdAuction = await this.prisma.auction.create({
                data: {
                    ...dto,
                    status: "In progress"
                }
            })
            return createdAuction;
        } catch (error) {
            console.log(error)
            throw new BadRequestException('Something went wrong while creating new auction!')
        }
    }

    //SPREMENI AVATAR SLIKO
    async updateAuctionImage(
        id: number,
        image: string
    ): Promise<Auction> {
        console.log({ id, image })
        //klici auction update, vendar samo z avatar linkom
        return this.update(id, {
            image,
            title: undefined,
            currentPrice: undefined,
            status: undefined,
            duration: undefined
        })
    }

    //SPREMENI STATUS GLEDE NA DATE (OB PRIDOBITVI AUCTIONA/U?)
    //UPDATE AVTOMATSKE VARIANTE
    async statusDateChange(
        id: number
    ): Promise<Auction> {
        //PREVERI CE JE CURRENT DATE CEZ DURATION DATE, CE JE SPREMENI STATUS V DONE
        const auction = this.getById(id)
        if (Date.now() > (await auction).duration.getTime()) {
            const status = "Done"
            try {
                const editedAuction = await this.prisma.auction.update({
                    where: { id },
                    data: {
                        status: status
                    }
                })
                return editedAuction;
            } catch (error) {
                if (error instanceof PrismaClientKnownRequestError) {
                    //error, kjer posljemo id, ki ne obstaja v DB
                    if (error.code === 'P2025')
                        throw new BadRequestException(`Id ${id} is invalid!`);
                }
                else {
                    console.log(error)
                    throw new BadRequestException('Something went wrong while updating auction!')
                }
            }
        }
        return auction
    }

    //UPDATE AUCTION
    //UPDATE SAMO Z USERJOVE STRANI (glej Date Invalid)
    async update(
        id: number,
        dto: UpdateAuctionDto
    ): Promise<Auction> {
        // console.log(dto)

        //CAS MORA BITI V PRIHODNOSTI
        //avtomatski changeDate ne klice edit() funkcije, ker bi ta if prepreceval ustrezno posodobitev
        if (Date.now() > new Date(dto.duration).getTime()) {
            console.log('Date invalid!')
            throw new ForbiddenException('Date must be valid!');
        }
        //spremeni duration iz string v Date (ker posiljamo json)
        if (dto.duration) {
            dto = {
                ...dto,
                duration: new Date(dto.duration)
            }
        }

        try {
            const editedAuction = await this.prisma.auction.update({
                where: { id },
                data: {
                    ...dto
                }
            })
            return editedAuction;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                //error, kjer posljemo id, ki ne obstaja v DB
                if (error.code === 'P2025')
                    throw new BadRequestException(`Id ${id} is invalid!`);
            }
            else {
                console.log(error)
                throw new BadRequestException('Something went wrong while updating auction!')
            }
        }
    }

    //DOBI VSE BIDE KI SO NA AUCTIONU
    async getBids(
        auctionId: number
    ): Promise<Bid[]> {
        return this.bidService.getAllForAuction(auctionId)
    }

    //BIDDAJ NA EN AUCTION
    async bidOnId(
        auctionId: number,
        dto: CreateBidDto,
        userId: number
    ): Promise<Bid> {
        //preveri ce je podan price vecji od trenutnega
        if (dto.price > (await this.getById(auctionId)).currentPrice) {
            const bid = this.bidService.create(auctionId, dto, userId)
            //IF BID SUCCESSFUL: update(new_currency)
            if (bid) {
                const currentPrice = (await bid).price
                //klici auction update in spremeni le price
                this.update(auctionId, {
                    currentPrice,
                    title: undefined,
                    status: undefined,
                    duration: undefined
                })
                return bid
            }
        }
        else {
            throw new BadRequestException('New bid must be higher than current price!')
        }
    }
}
