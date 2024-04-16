import { Controller, Get, HttpCode, HttpStatus, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard';

//nastavi dostop do route: users/... z UseGuards (restricta VSE route v tem fileu)
//@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {
        this.userService.find()
    }

    @HttpCode(HttpStatus.OK)
    //PROTECT ROUTE Z JWT-PASSPORT GUARDOM (glej auth/strategy/jwt.strategy)
    //default: 'jwt', 'jwt-refresh' za refresh token
    @UseGuards(JwtGuard)
    @Get('me')
    //dobi posamezni var z @GetUser('email') email: string
    async find(@GetUser() user: User) {
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
