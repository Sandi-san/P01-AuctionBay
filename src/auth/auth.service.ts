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

    //REGISTER USER
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

    //LOGIN USER
    async login(dto: AuthDto) {
        //find user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })
        //ce user ne obstaja, vrni exception (guard condition)
        if(!user) throw new ForbiddenException('User with that email does not exist!')

        //preveri password (password iz base, password iz dto)
        const pwMatch = await argon.verify(user.password,dto.password)
        if(!pwMatch) throw new ForbiddenException('Passwords do not match!')

        //delete password is user objekta (ne baze) predenj returnas kot json
        delete user.password
        //return user
        return user
    }
}
