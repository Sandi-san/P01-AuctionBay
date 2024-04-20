import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AuctionService } from './auction.service';

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
    async getAuction() {
        //async getAuctions(): Promise<Auction> {
        return this.auctionService.getById(0)
    }
    
    //BID ON AUCTION BY ID
    @HttpCode(HttpStatus.OK)
    @Get(':id/bid')
    async bidOnAuction() {
        //async getAuctions(): Promise<Auction> {
        return this.auctionService.bidOnId(0)
    }

}
