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

    //PAGINATE
    //Service za findAll (vseh tabel)
    async findAllPaginate(page = 1, relations = []): Promise<PaginatedResult> {
        const take = 14 //max stevilo za current display
        try {

            const data = await this.prisma.auction.findMany({
                take,
                skip: (page - 1) * take,
                where: {
                    duration: {
                        gt: new Date(), // Filter out auctions that have already ended
                    },
                },
                include: {
                    // Include any relations you need
                    // BIDS
                },
                orderBy: {
                    duration: 'asc', //order by
                }
            })

            //countaj te auctione vendar z gt: currentTime filtrom
            const total = await this.prisma.auction.count({
                where: {
                    duration: {
                        gt: new Date(),
                    },
                },
            });

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
        userId: number,
        page = 1,
        relations = []
    ): Promise<PaginatedResult> {
        const take = 14
        try {
            const auctions = await this.prisma.auction.findMany({
                where: { userId },
                orderBy: {
                    createdAt: 'desc',
                },
                take: take,
                skip: (page - 1) * take,
            });

            const total = await this.prisma.auction.count({
                where: { userId },
            });

            return {
                data: auctions,
                meta: {
                    total,
                    page,
                    last_page: Math.ceil(total / take),
                },
            };
        } catch (error) {
            console.error(error)
            throw new BadRequestException(`Something went wrong while getting auctions from user with id ${userId}!`)
        }
    }

    //DOBI VSE AUCTIONE KJER USER ZMAGAL
    async getAllForUserWon(
        userId: number,
        page = 1,
        relations = []
    ): Promise<PaginatedResult> {
        try {
            const take = 14
            let auctions = []

            //filtriraj auctione z duration ki je ze potekel
            const filteredAuctions = await this.prisma.auction.findMany({
                where: {
                    duration: {
                        lt: new Date()
                    }
                },
                orderBy: {
                    duration: 'desc',
                }
            })

            //dobi auctione kjer je userId postavil zadnji bid
            await Promise.all(filteredAuctions.map(async (auction) => {
                //dobi zadnji bid od auctiona
                const latestBid = await this.prisma.bid.findFirst({
                    where: {
                        auctionId: auction.id
                    },
                    orderBy: {
                        createdAt: 'desc' // Order by latest bid createdAt
                    }
                });

                // check ce je (le zadnji) bid od userja
                if (latestBid && latestBid.userId === userId) {
                    auctions.push(auction);
                }
            }));

            // paginate result
            const total = auctions.length;
            const paginatedAuctions = auctions.slice((page - 1) * take, page * take);

            return {
                data: paginatedAuctions,
                meta: {
                    total,
                    page,
                    last_page: Math.ceil(total / take),
                },
            };
        } catch (error) {
            console.error(error)
            throw new BadRequestException(`Something went wrong while getting auctions from user with id ${userId}!`)
        }
    }

    //DOBI VSE AUCTIONE KJER USER TRENUTNO BIDDA
    async getAllForUserBidding(
        userId: number,
        page = 1,
        relations = []
    ): Promise<PaginatedResult> {
        try {
            const take = 14

            // Step 1: Retrieve all auctions with a duration in the future
            const filteredAuctions = await this.prisma.auction.findMany({
                where: {
                    duration: {
                        gt: new Date() // Auction duration is in the future
                    }
                },
                orderBy: {
                    duration: 'desc',
                }
            });

            // Step 2: Filter auctions to ensure the latest bid is from the specified userId
            let auctions = [];

            await Promise.all(filteredAuctions.map(async (auction) => {
                const latestBid = await this.prisma.bid.findFirst({
                    where: {
                        auctionId: auction.id
                    },
                    orderBy: {
                        createdAt: 'desc' // Latest bid
                    }
                });

                // Check if the latest bid is from the specified userId
                if (latestBid && latestBid.userId === userId) {
                    auctions.push(auction);
                }
            }));

            // Step 3: Implement pagination on the filtered results
            const total = auctions.length;
            const paginatedAuctions = auctions.slice((page - 1) * take, page * take);

            return {
                data: paginatedAuctions,
                meta: {
                    total,
                    page,
                    last_page: Math.ceil(total / take),
                },
            };
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

    //SPREMENI STATUS AUCTIONV GLEDE NA DATE (PRED PRIDOBITVI AUCTIONOV)
    //UPDATE AVTOMATSKE VARIANTE
    async changeStatusByDate(): Promise<void> {
        console.log("Calling change Auctions status")

        //Dobi vse auctione ki niso Status==Done
        const allAuctions = await this.prisma.auction.findMany({
            where:{
                status: {
                    not: 'Done'
                }
            },
            orderBy: {
                duration: 'desc',
            }
        });

        let count=0

        //Ce je cas potekel, status=Done
        await Promise.all(allAuctions.map(async (auction) => {
            if (new Date(auction.duration) < new Date()) {
                await this.prisma.auction.update({
                    where: { id: auction.id },
                    data: { status: 'Done' }
                });
                count++
            }
        }));
        console.log("Changed auctions: ",count)
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
