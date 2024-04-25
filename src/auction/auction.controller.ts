import { BadRequestException, Body, Controller, ForbiddenException, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { Auction, Bid, User } from '@prisma/client';
import { GetLoggedUser } from 'src/auth/decorator';
import { CreateBidDto } from 'src/bid/dto/create-bid.dto';
import { JwtGuard } from 'src/auth/guard';

@Controller('auctions')
export class AuctionController {
    constructor(private auctionService: AuctionService) { }

    //DOBI VSE AUCTION-E
    @HttpCode(HttpStatus.OK)
    @Get('')
    async getAll() {
        //async getAuctions(): Promise<Auction> {
        return this.auctionService.getAll()
    }

    //DOBI AUCTION BY ID
    @HttpCode(HttpStatus.OK)
    @Get(':id')
    async getAuction(
        @Param('id') id: string
    ): Promise<Auction> {
        //parsaj string iz url v int
        const auctionId = parseInt(id, 10)
        if (isNaN(auctionId)) {
            throw new BadRequestException('Invalid ID');
        }
        return this.auctionService.getById(auctionId)
    }

    //BID ON AUCTION BY ID
    @HttpCode(HttpStatus.OK)
    //user mora biti logged in za POST bid
    @UseGuards(JwtGuard)
    @Post(':id/bid')
    async bidOnAuction(
        @Param('id') id: string,
        @Body() dto: CreateBidDto,
        @GetLoggedUser() user: User,
    ): Promise<Bid> {
        //parsaj string iz url v int
        const auctionId = parseInt(id, 10)
        if (isNaN(auctionId)) {
            throw new BadRequestException('Invalid ID');
        }

        return this.auctionService.bidOnId(auctionId, dto, user.id)
    }
}
