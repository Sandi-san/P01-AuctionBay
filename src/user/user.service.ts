import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    //POVEZAVA Z REPOSITORY
    constructor(private prisma: PrismaService) { }

    async find(){
        return "Reached find()"
    }
    /*
    async findAll(): User[] {
        return this.users;
    }

    async findById(id: string): User {
        return this.users.find(user => user.id === id);
    }
    */
}
