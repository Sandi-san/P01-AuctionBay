import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  //dodaj jwt za authentication
  imports: [JwtModule.register({})],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
