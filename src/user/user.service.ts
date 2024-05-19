import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Auction, Bid, User } from '@prisma/client';
import { AuctionService } from 'src/auction/auction.service';
import { BidService } from 'src/bid/bid.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateAuctionDto, UpdateAuctionDto } from 'src/auction/dto';

@Injectable()
export class UserService {
    //POVEZAVA Z REPOSITORY
    constructor(
        private prisma: PrismaService,
        private auctionService: AuctionService,
        private bidService: BidService
    ) { }

    //SPREMENI AVATAR SLIKO
    async updateUserImage(
        id: number,
        image: string
    ): Promise<User> {
        console.log({ id, image })
        //klici user update, vendar samo z avatar linkom
        return this.update(id, { image })
    }

    //UPDATE USER INFO
    async update(
        id: number,
        updateUserDto: UpdateUserDto
    ): Promise<User> {
        //confirm_password vrne error, ker ni v Prismi DB, je pa v frontendu
        delete updateUserDto.confirm_password
        delete updateUserDto.old_password
        delete updateUserDto.password

        try {
            //spremeni vrednosti userja in posodobi bazo
            const updatedUser = await this.prisma.user.update({
                where: { id },
                data: {
                    ...updateUserDto,
                    //ce slucajno dobil password v dto, odstrani 
                    //password se NE sme spreminjat v update(), samo v changePassword()
                    password: undefined,
                }
            })
            return updatedUser
        } catch (error) {
            //preveri ce se je pojavil v prisma clientu
            if (error instanceof PrismaClientKnownRequestError) {
                //error, kjer email novega register userja ze obstaja v bazi
                if (error.code === 'P2002')
                    throw new ForbiddenException('Email already taken!');
                //error, kjer posljemo id, ki ne obstaja v DB (za prisma.update ONLY)
                else if (error.code === 'P2025')
                    throw new BadRequestException(`Id ${id} is invalid!`);
            } else {
                //ni email alredy taken error, vrni prvotnega
                console.log(error)
                throw new BadRequestException('Something went wrong while updating user!')
            }
        }
    }

    //UPDATE USER PASSWORD
    async changePassword(
        id: number,
        updateUserDto: UpdateUserDto
    ): Promise<{ response: string }> {
        //dobo userja iz db
        const user = await this.prisma.user.findUnique({
            where: { id }
        })

        //user ne obstaja
        if (!user) throw new NotFoundException(`User with id \'${id}\' does not exist!`)

        //destructiraj posamezne var iz dto
        const { old_password, password, confirm_password } = updateUserDto

        //preveri ce user dodal oba passworda
        if (password && confirm_password) {
            //preveri ce user dodal stari password (glej frontend formo)
            if (!old_password)
                throw new BadRequestException('Please input old password!')

            const pwMatchOld = await argon.verify(user.password, old_password)
            if (!pwMatchOld)
                throw new BadRequestException('Old password is incorrect!')

            //passworda sta razlicna
            if (password !== confirm_password)
                throw new BadRequestException('Passwords do not match!')
            //password isti kot v bazi?
            //preveri password (password iz base, password iz dto)
            const pwMatch = await argon.verify(user.password, password)
            if (pwMatch)
                throw new BadRequestException('New password cannot be the same as old password!')
            //vse vredu? hashaj nov password in shrani v user objekt
            const hashedPass = await argon.hash(password)

            try {
                //posodobi bazo (spremeni le password, ostalo v dto ignoriraj)
                await this.prisma.user.update({
                    where: { id },
                    data: {
                        password: hashedPass
                    }
                })

                return { response: 'Password changed successfully!' }
            } catch (error) {
                //preveri ce se je pojavil v prisma clientu
                if (error instanceof PrismaClientKnownRequestError) {
                    //error, kjer posljemo id, ki ne obstaja v DB
                    if (error.code === 'P2025')
                        throw new BadRequestException(`Id ${id} is invalid!`);
                } else {
                    console.log(error)
                    throw new BadRequestException('Something went wrong while updating user password!')
                }
            }
        }
        return { response: 'Something went wrong while changing password!' }
    }

    //DOBI VSE POSTANE AUCTIONE OD USERJA
    async getUserAuctions(
        userId: number
    ): Promise<Auction[]> {
        return this.auctionService.getAllForUser(userId)
    }

    //DOBI VSE AUCTIONE KJER USER WONNAL
    async getUserAuctionsWon(
        userId: number
    ): Promise<Auction[]> {
        return this.auctionService.getAllForUserWon(userId)
    }

    //DOBI VSE AUCTIONE KJER USER BIDDA
    async getUserAuctionsBidding(
        userId: number
    ): Promise<Auction[]> {
        return this.auctionService.getAllForUserBidding(userId)
    }

    //DOBI EN AUCTION OD USERJA
    async getUserAuction(
        id: number
    ): Promise<Auction> {
        return this.auctionService.getById(id)
    }

    //USTAVARI NOV AUCTION
    async createUserAuction(
        userId: number,
        dto: CreateAuctionDto
    ): Promise<Auction> {
        return this.auctionService.create(userId, dto)
    }

    //UPDATE AUCTION
    async editUserAuction(
        auctionId: number,
        dto: UpdateAuctionDto
    ): Promise<Auction> {
        return this.auctionService.update(auctionId, dto)
    }

    //SPREMENI SLIKO AUCTIONA
    async uploadAuctionImage(
        auctionId: number,
        image: string
    ): Promise<Auction> {
        console.log({ auctionId, image })
        //klici auction update, vendar samo z sliko
        return this.auctionService.updateAuctionImage(auctionId, image)
    }

    //DOBI VSE BIDE KI JE USER USTVARIL
    async getUserBids(
        userId: number
    ): Promise<Bid[]> {
        return this.bidService.getAllForUser(userId, true)
    }

    //DOBI VSE BIDE S KATERIMI JE USER ZMAGAL
    async getUserBidsWon(
        userId: number
    ): Promise<Bid[]> {
        return this.bidService.getAllForUser(userId, false)
    }
}
