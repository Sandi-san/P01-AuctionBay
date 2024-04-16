import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

//VALIDACIJA JWT ACCESS TOKENA
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        config: ConfigService,
        private prisma: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            //jwt secret iz .env
            secretOrKey: config.get('JWT_SECRET')
        })
    }

    //validiraj token (funkcija se klice pri AuthGuard('jwt') routu)
    async validate(payload: { sub: number, email: string }) {
        //najdi user v DB glede na access token
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub
            }
        })
        delete user.password
        return user
    }
}