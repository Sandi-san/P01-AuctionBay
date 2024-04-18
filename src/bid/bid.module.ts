import { Module, forwardRef } from '@nestjs/common';
import { BidService } from './bid.service';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [BidService],
  //controllers: [BidController],
  exports: [BidService]
})
export class BidModule {}
