import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

//struktura data, ki se poslje v funkcijo ko kreiramo Auction
export class CreateAuctionDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  currentPrice: number;

  @IsString()
  status: string;

  @IsDateString()
  duration: Date;

  @IsOptional()
  image?: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
