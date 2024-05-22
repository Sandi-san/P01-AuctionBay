import { Module } from '@nestjs/common';
import { BidService } from './bid.service';

@Module({
  providers: [BidService],
  //controllers: [BidController],
  exports: [BidService],
})
export class BidModule {}
