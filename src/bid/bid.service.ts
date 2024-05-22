import { BadRequestException, Injectable } from '@nestjs/common';
import { Bid } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBidDto } from './dto/create-bid.dto';

@Injectable()
export class BidService {
  //POVEZAVA Z REPOSITORY
  constructor(private prisma: PrismaService) {}

  //DOBI VSE BIDE OD USER-JA
  async getAllForUser(userId: number): Promise<Bid[]> {
    //get all user bids
    try {
      const bids = await this.prisma.bid.findMany({
        where: { userId },
      });
      return bids;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        `Something went wrong while getting bids for user with id ${userId}!`,
      );
    }
  }

  //DOBI VSE BIDDE OD AUCTIONA
  async getAllForAuction(auctionId: number): Promise<Bid[]> {
    try {
      const bids = await this.prisma.bid.findMany({
        where: { auctionId },
        include: {
          //vrni tudi USER data
          user: {
            // vrni samo dolocene elemente
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc', //order by
        },
      });
      return bids;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        `Something went wrong while getting bids for auction with id ${auctionId}!`,
      );
    }
  }

  //SPREMENI STATUS VSEH OSTALIH BIDOV KO SE POSTA NOV (Winning->In progress?)
  //Bid status je odstranjen/neneuporabljen
  // async changeBidsStatus() {
  //     return 'TODO: changing other bids'
  // }

  //BIDDAJ NA EN AUCTION
  async create(
    auctionId: number,
    dto: CreateBidDto,
    userId: number,
  ): Promise<Bid> {
    //dodaj tudi foreign key-e
    dto = {
      ...dto,
      userId: userId,
      auctionId: auctionId,
    };

    try {
      const createdBid = await this.prisma.bid.create({
        data: {
          ...dto,
        },
      });
      return createdBid;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Something went wrong while creating new bid!',
      );
    }
  }
}
