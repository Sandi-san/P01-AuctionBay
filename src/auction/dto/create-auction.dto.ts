import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAuctionDto{
    @IsString()
    title: string
  
    @IsString()
    @IsOptional()
    description?: string
  
    @IsNumber()
    currentPrice: number

    @IsString()
    status: string

    @IsDateString()
    duration: Date

    @IsOptional()
    image?: string

    @IsNumber()
    @IsNotEmpty()
    userId: number
}