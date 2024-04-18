import { IsEmail, IsOptional, IsString, Matches, ValidateIf } from 'class-validator'
import { Match } from 'src/auth/decorator'

export class UpdateUserDto {
  @IsOptional()
  firstName?: string

  @IsOptional()
  lastName?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @ValidateIf((o) => typeof o.password === 'string' && o.password.length > 0)
  @IsOptional()
  @IsString()
  @Matches(/^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&+=`|{}:;!.?"()[\]-]{6,}/, {
    message:
      'Password must contain one number, one uppercase or lowercase letter and has to be longer than 5 characters!',
  })
  password?: string

  @ValidateIf((o) => typeof o.confirm_password === 'string' && o.confirm_password.length > 0)
  @IsOptional()
  @IsString()
  //custom decorator ()
  @Match(UpdateUserDto, (field) => field.password, {
    message: 'Passwords must match!',
  })
  confirm_password?: string

  // @IsOptional()
  // refresh_token?: string

  @IsOptional()
  image?: string
}
