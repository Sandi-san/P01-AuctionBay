import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuctionService } from 'src/auction/auction.service';
import { BidService } from 'src/bid/bid.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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
        console.log({id,image})
        //klici user update, vendar samo z avatar linkom
        return this.update(id, { image })
    }

    //UPDATE USER INFO
    async update(
        id: number, 
        updateUserDto: UpdateUserDto
    ): Promise<User> {
        console.log({id,updateUserDto})
        //dobi userja iz db
        const user = await this.prisma.user.findUnique({
            where: { id }
        })
        //user ne obstaja
        if (!user) throw new NotFoundException(`User with id \'${id}\' does not exist!`)

        try {
            //spremeni vrednosti userja in posodobi bazo
            const updatedUser = await this.prisma.user.update({
                where: { id },
                data: {
                    ...updateUserDto,
                    //ce slucajno dobil password v dto, odstrani 
                    //password se NE sme spreminjat v update(), samo v changePassword()
                    password: undefined
                }
            })
            delete updatedUser.password
            return updatedUser
        } catch (error) {
            //preveri ce se je pojavil v prisma clientu
            if (error instanceof PrismaClientKnownRequestError) {
                //error, kjer email novega register userja ze obstaja v bazi
                if (error.code === 'P2002')
                    throw new ForbiddenException('Email already taken!');
            } else {
                //ni email alredy taken error, vrni prvotnega
                console.log(error)
                throw new BadRequestException('Something went wrong while creating new user!')
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

        //destructiraj posamezne var iz dto
        const { password, confirm_password } = updateUserDto
        
        //preveri ce user dodal oba passworda
        if (password && confirm_password) {
            //passworda sta razlicna
            if (password !== confirm_password)
                throw new BadRequestException('Passwords do not match!')
            //password isti kot v bazi?
            //preveri password (password iz base, password iz dto)
            const pwMatch = await argon.verify(user.password, password)
            if (pwMatch)
                throw new BadRequestException('New password cannot be the same as old password!')
            //vse vredu? hashaj nov password in shrani v user objekt
            user.password = await argon.hash(password)
        }
        //vrni user-ja, ce se pass ni spremenil, ostane isti 
        return { response: 'Password changed successfully!' }
    }

    //DOBI VSE POSTANE AUCTIONE OD USERJA
    async getUserAuctions() {
        return this.auctionService.getAllForUser()
    }

    //USTAVARI NOV AUCTION
    async createUserAuction() {
        return this.auctionService.create()
    }

    //UPDATE AUCTION
    async editUserAuction() {
        return this.auctionService.edit()
    }

    //DOBI VSE BIDE KI JE USER USTVARIL
    async getUserBids() {
        return this.bidService.getAllForUser()
    }

    //DOBI VSE BIDE S KATERIMI JE USER ZMAGAL
    async getUserBidsWon() {
        return this.bidService.getAllWonForUser()
    }
}
