//DEFINIRAJ OBLIKO BODY PRI POST (CREATE) ZAHTEVKIH

import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator"
import { Match } from "../decorator";

export class RegisterUserDto{
    @IsOptional()
    firstName?: string
  
    @IsOptional()
    lastName?: string
  
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&+=`|{}:;!.?"()[\]-]{6,}/, {
      message:
        'Password must contain one number, one uppercase or lowercase letter and has to be longer than 5 characters!',
    })
    password: string
  
    @IsNotEmpty()
    @IsString()
    //custom decorator ()
    @Match(RegisterUserDto, (field) => field.password, {
      message: 'Passwords must match!',
    })
    confirm_password: string
}