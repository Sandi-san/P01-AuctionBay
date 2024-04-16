//ROUTE MANAGER
//KLIČE SE PRVI OB ROUTE REQUESTIH

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    register(@Body() dto: AuthDto) {
        console.log(dto)
        return this.authService.register(dto)
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() dto: AuthDto) {
        console.log(dto)
        return this.authService.login(dto)
    }
}
