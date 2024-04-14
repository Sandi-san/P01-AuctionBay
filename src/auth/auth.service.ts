//DEJANSKA LOGIKA IZ CONTROLLERJA/ROUTEOV

import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
//za password hashing
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
    //POVEZAVA Z REPOSITORY
    constructor(private prisma: PrismaService) { }

    async register(dto: AuthDto) {
        //generiraj hash za password
        const hash = await argon.hash(dto.password)

        try {
            //shrani user v db (data=format ki se shrani v bazo)
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password: hash,
                }
            })
            //odstrani password var predenj vrnes userja
            //POZOR: v password ne bo vec obstajal v tem user objektu (v DB se shrani normalno)
            delete user.password

            //return user
            return user
        } catch (error) {
            //preveri ce se je pojavil v prisma clientu
            if (error instanceof PrismaClientKnownRequestError) {
                //error, kjer email novega register userja ze obstaja v bazi
                if(error.code==='P2002')
                    throw new ForbiddenException('Email already taken!');
            } else {
                //ni email alredy taken error, vrni prvotnega
                throw error;
            }
        }
    }

    login() {
        return "Reached login from controller to service"
    }
}
