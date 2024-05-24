import { Module, forwardRef } from '@nestjs/common';
import { AuctionController } from './auction.controller';
import { AuctionService } from './auction.service';
import { UserModule } from 'src/user/user.module';
import { BidModule } from 'src/bid/bid.module';

@Module({
  imports: [BidModule, forwardRef(() => UserModule)],
  controllers: [AuctionController],
  providers: [AuctionService],
  exports: [AuctionService],
})
export class AuctionModule {}
