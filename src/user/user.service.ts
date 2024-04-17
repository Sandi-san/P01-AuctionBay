import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    //POVEZAVA Z REPOSITORY
    constructor(private prisma: PrismaService) { }

    //UPDATE USER INFO
    async update() {

    }

    //UPDATE USER PASSWORD
    async changePassword() {

    }

    //SPREMENI AVATAR SLIKO
    async updateUserImage() {

    }
}
