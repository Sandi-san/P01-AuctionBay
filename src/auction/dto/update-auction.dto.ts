import { IsDate, IsOptional, IsString } from "class-validator"

export class UpdateAuctionDto{
    @IsString()
    title: string
  
    @IsString()
    @IsOptional()
    description?: string

    @IsString()
    status: string

    @IsDate()
    duration: Date

    @IsOptional()
    image?: string
}