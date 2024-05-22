import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

//struktura data, ki se poslje v funkcijo ko updateamo Auction
export class UpdateAuctionDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  currentPrice: number;

  @IsString()
  @IsOptional()
  status: string;

  @IsDateString()
  duration: Date;

  @IsOptional()
  image?: string;
}
