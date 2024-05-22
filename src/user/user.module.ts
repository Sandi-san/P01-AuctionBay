import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuctionModule } from 'src/auction/auction.module';
import { BidModule } from 'src/bid/bid.module';

@Module({
  //imports: [forwardRef(() => AuctionModule), BidModule],
  imports: [AuctionModule, BidModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
