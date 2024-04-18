import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuctionModule } from './auction/auction.module';
import { BidModule } from './bid/bid.module';

@Module({
  //DEFINIRAJ VSE MODULE PROJEKTA, DA BO LAHKO APP ZAZNAL
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    PrismaModule,
    AuthModule,
    UserModule,
    AuctionModule,
    BidModule,
  ],
})
export class AppModule {}
