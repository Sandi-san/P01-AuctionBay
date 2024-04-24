import { BadRequestException, Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { Auction } from '@prisma/client';

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
    @Get(':id/bid')
    async bidOnAuction(
        @Param('id') id: string
    ) {
        //parsaj string iz url v int
        const auctionId = parseInt(id, 10)
        if (isNaN(auctionId)) {
            throw new BadRequestException('Invalid ID');
        }
        return this.auctionService.bidOnId(auctionId)
    }

}
