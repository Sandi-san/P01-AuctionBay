import { IsNumber, IsString } from 'class-validator';

//struktura data za ustvarjanje Bid-a
export class CreateBidDto {
  @IsNumber()
  price: number;

  @IsString()
  status: string;

  @IsNumber()
  //@IsNotEmpty()
  userId: number;

  @IsNumber()
  //@IsNotEmpty()
  auctionId: number;
}
