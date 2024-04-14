//ROUTE MANAGER
//KLIČE SE PRVI OB ROUTE REQUESTIH

import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){
    }

    @Post('register')
    register(@Body() dto: AuthDto){
        return this.authService.register(dto)
    }

    @Post('login')
    login(){
        return this.authService.login()
    }
}
