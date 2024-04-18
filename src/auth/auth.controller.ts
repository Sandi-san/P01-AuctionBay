//ROUTE MANAGER
//KLIČE SE PRVI OB ROUTE REQUESTIH

import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express'
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.CREATED)
    @Post('signup')
    register(
        @Body() dto: RegisterUserDto,
        @Res({ passthrough: true }) res: Response
    ) {
        //console.log(dto)
        
        //dobi jwt access token
        const access_token = this.authService.register(dto)
        //shrani access token kot cookie v browserju
        res.cookie('access_token', access_token, { httpOnly: true })
        return access_token
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(
        @Body() dto: LoginUserDto,
        @Res({ passthrough: true }) res: Response
    ) {
        //console.log(dto)
        
        //dobi jwt access token
        const access_token = this.authService.login(dto)
        //shrani access token kot cookie v browserju
        res.cookie('access_token', access_token, { httpOnly: true })
        return access_token
    }

    @HttpCode(HttpStatus.OK)
    @Post('signout')
    async signout(@Res({ passthrough: true }) res: Response): Promise<{ msg: string }> {
        //delete token iz cookies
        res.clearCookie('access_token')
        return { msg: 'logout successful' }
    }
}
