//DEJANSKA LOGIKA IZ CONTROLLERJA/ROUTEOV

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUserDto, RegisterUserDto } from './dto';
//za password hashing
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  //POVEZAVA Z REPOSITORY
  constructor(
    private prisma: PrismaService,
    //za jwt token user authentication
    private jwt: JwtService,
    //za dostop do .env var
    private config: ConfigService,
  ) {}

  //REGISTER USER
  async register(dto: RegisterUserDto): Promise<{ access_token: string }> {
    //generiraj hash za password
    const hash = await argon.hash(dto.password);

    try {
      //shrani user v db (data=format ki se shrani v bazo)
      const user = await this.prisma.user.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          password: hash,
        },
      });
      //odstrani password var predenj vrnes userja
      //POZOR: v password ne bo vec obstajal v tem user objektu (v DB se shrani normalno)
      //delete user.password

      return this.signToken(user.id, user.email);
    } catch (error) {
      //preveri ce se je pojavil v prisma clientu
      if (error instanceof PrismaClientKnownRequestError) {
        //error, kjer email novega register userja ze obstaja v bazi
        if (error.code === 'P2002')
          throw new ForbiddenException('Email already taken!');
      } else {
        //ni email alredy taken error, vrni prvotnega
        console.log(error);
        throw new BadRequestException(
          'Something went wrong while creating new user!',
        );
      }
    }
  }

  //LOGIN USER
  async login(dto: LoginUserDto): Promise<{ access_token: string }> {
    //find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    //ce user ne obstaja, vrni exception (guard condition)
    if (!user)
      throw new NotFoundException('User with that email does not exist!');

    //preveri password (password iz base, password iz dto)
    const pwMatch = await argon.verify(user.password, dto.password);
    if (!pwMatch) throw new UnauthorizedException('Passwords do not match!');

    return this.signToken(user.id, user.email);
  }

  //JWT AUTHENTICATION TOKEN ZA LOGIN
  //za login/register vrni access_token
  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    //struktura jwt token
    const payload = {
      sub: userId,
      email,
    };
    try {
      //(payload, signature)
      const token = await this.jwt.signAsync(payload, {
        expiresIn: '15m',
        secret: `${this.config.get('JWT_SECRET')}`,
      });

      //definiraj strukturo return stavka (json)
      return {
        access_token: token,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Something went wrong while creating access token!',
      );
    }
  }
}
