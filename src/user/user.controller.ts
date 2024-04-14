import { Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { UserService } from './user.service';

//nastavi dostop do route: users/... z UseGuards
//@UseGuards(JwtGuard) //auth/guard
@Controller('users')
export class UserController {
    
    constructor(private userService: UserService){
        this.userService.find()
    }
    
    /*
    @Get('me')
    async find(@GetUser('') user: User) {
        //dobi info userja glede trenutni access token
        return user
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
