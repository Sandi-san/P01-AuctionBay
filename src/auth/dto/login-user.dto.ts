import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

//struktura data, ki posiljamo pri user login (POST)
export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
