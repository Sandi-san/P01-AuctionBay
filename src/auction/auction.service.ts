import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BidService } from 'src/bid/bid.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAuctionDto, UpdateAuctionDto } from './dto';
import { Auction, Bid } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateBidDto } from 'src/bid/dto/create-bid.dto';
import { PaginatedResult } from 'src/interfaces/paginated-result.interface';


interface BidGroupBySelect {
    _max: {
        createdAt: true;
    };
    auctionId: true;
    createdAt: true;
}

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
    //Service za findAll (vseh tabel)
    async paginate(page = 1, relations = []): Promise<PaginatedResult> {
        const take = 10 //max stevilo za current display
        try {
            const data = await this.prisma.auction.findMany({
                take,
                skip: (page - 1) * take,
                include: {
                    // Include any relations you need
                    // Example: user: true,
                },
                orderBy: {
                    createdAt: 'desc', //order by createdAt in descending order
                }
            })

            const total = await this.prisma.auction.count();

            return {
                data,
                meta: {
                    total,
                    page,
                    last_page: Math.ceil(total / take),
                },
            }
        } catch (error) {
            throw new InternalServerErrorException('Something went wrong while searching for paginated elements')
        }
    }

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

    async delete(
        id: number
    ): Promise<Auction> {
        try {
            const auction = await this.prisma.auction.delete({
                where: { id }
            })

            if (!auction) throw new NotFoundException(`Auction with id \'${id}\' does not exist!`)

            console.log("Deleting auction:", id)
            return auction
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

    //DOBI VSE AUCTIONE KJER USER ZMAGAL
    async getAllForUserWon(
        userId: number
    ): Promise<Auction[]> {
        try {
            let auctions = []

            //filtriraj auctione z duration ki je ze potekel
            const filteredAuctions = await this.prisma.auction.findMany({
                where: {
                    duration: {
                        lt: new Date()
                    }
                }
            });

            //dobi auctione kjer je userId postavil zadnji bid
            const auctionsWithLatestBidAndUserId = await Promise.all(filteredAuctions.map(async (auction) => {
                //dobi zadnji bid od auctiona
                const latestBid = await this.prisma.bid.findFirst({
                    where: {
                        userId,
                        auctionId: auction.id,
                    },
                    orderBy: {
                        createdAt: 'desc' // Latest bid createdAt
                    }
                });

                if (latestBid) {
                    auctions.push(auction);
                }
            }));

            return auctions
        } catch (error) {
            console.error(error)
            throw new BadRequestException(`Something went wrong while getting auctions from user with id ${userId}!`)
        }
    }

    //DOBI VSE AUCTIONE KJER USER TRENUTNO BIDDA
    async getAllForUserBidding(
        userId: number
    ): Promise<Auction[]> {
        try {
            const auctions = await this.prisma.auction.findMany({
                where: {
                    duration: {
                        //auction ima duration v prihodnosti
                        gt: new Date()
                    },
                    Bid: {
                        some: {
                            //filtriraj bide glede trenutnega userja (userId)
                            userId
                        }
                    }
                }
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
        console.log(dto)

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
            //preveri ce je auction od userja ki bidda
            if (userId != ((await this.getById(auctionId)).userId)) {
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
                throw new BadRequestException('You cannot bid on your own auction!')
            }
        }
        else {
            throw new BadRequestException('New bid must be higher than current price!')
        }
    }
}
