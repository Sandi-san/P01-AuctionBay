import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { Auction, Bid, User } from '@prisma/client';
import { GetLoggedUser } from 'src/auth/decorator';
import { CreateBidDto } from 'src/bid/dto/create-bid.dto';
import { JwtGuard } from 'src/auth/guard';
import { PaginatedResult } from 'src/interfaces/paginated-result.interface';

@Controller('auctions')
export class AuctionController {
    constructor(private auctionService: AuctionService) { }

    //DOBI VSE AUCTION-E
    @HttpCode(HttpStatus.OK)
    @Get('')
    async getAll(@Query('page') page: number): Promise<PaginatedResult> {
        return this.auctionService.findAllPaginate(page)
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

    //DELETE AUCTION BY ID
    @HttpCode(HttpStatus.OK)
    //user mora biti logged in za DELETE auction
    @UseGuards(JwtGuard)
    @Delete(':id')
    async deleteAuction(
        @Param('id') id: string,
        @GetLoggedUser() user: User,
    ): Promise<Auction> {
        console.log(`Id: ${id} User: ${user}`)
        //parsaj string iz url v int
        const auctionId = parseInt(id, 10)
        if (isNaN(auctionId)) {
            throw new BadRequestException('Invalid ID');
        }
        return this.auctionService.delete(auctionId)
    }

    //DOBI BIDE OD AUCTION BY ID
    @HttpCode(HttpStatus.OK)
    @Get(':id/bids')
    async getBidsForAuction(
        @Param('id') id: string
    ): Promise<Bid[]> {
        //parsaj string iz url v int
        const auctionId = parseInt(id, 10)
        if (isNaN(auctionId)) {
            throw new BadRequestException('Invalid ID');
        }
        return this.auctionService.getBids(auctionId)
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
