import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuctionService } from 'src/auction/auction.service';
import { BidService } from 'src/bid/bid.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon from 'argon2'

@Injectable()
export class UserService {
    //POVEZAVA Z REPOSITORY
    constructor(
        private prisma: PrismaService,
        private auctionService: AuctionService,
        private bidService: BidService
    ) { }

    //SPREMENI AVATAR SLIKO
    async updateUserImage(id: number, avatar: string): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: { id }
        })
        //klici user update, vendar samo z avatar linkom
        return this.update(user.id, { avatar })
    }

    //UPDATE USER INFO
    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        //dobi userja iz db
        const user = await this.prisma.user.findUnique({
            where: { id }
        })
        //user ne obstaja
        if (!user) throw new NotFoundException(`User with id \'${id}\' does not exist!`)

        
        //spremeni vrednosti userja in posodobi bazo
        const updatedUser = await this.prisma.user.update({
            where: {id},
            data: {
                ...updateUserDto
            }
        })
        
        return updatedUser
    }

    //UPDATE USER PASSWORD
    async changePassword(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        //dobo userja iz db
        const user = await this.prisma.user.findUnique({
            where: { id }
        })
        
        //destructiraj posamezne var iz dto
        const {password, confirm_password} = updateUserDto
        
        //preveri ce user dodal oba passworda
        if (password && confirm_password) {
            //passworda sta razlicna
            if (password !== confirm_password)
                throw new BadRequestException('Passwords do not match!')
            //password isti kot v bazi?
            if(await argon.verify(user.password, password))
                throw new BadRequestException('New password cannot be the same as old password!')
            //vse vredu? hashaj nov password in shrani v user objekt
            user.password = await argon.hash(password)
        }
        //vrni user-ja, ce se pass ni spremenil, ostane isti 
        return user
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
