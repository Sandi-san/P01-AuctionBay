import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateBidDto{
    @IsNumber()
    price: number

    @IsString()
    status: string

    @IsNumber()
    //@IsNotEmpty()
    userId: number

    @IsNumber()
    //@IsNotEmpty()
    auctionId: number
}