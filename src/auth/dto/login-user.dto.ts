//DEFINIRAJ OBLIKO BODY PRI POST (CREATE) ZAHTEVKIH

import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class LoginUserDto{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}