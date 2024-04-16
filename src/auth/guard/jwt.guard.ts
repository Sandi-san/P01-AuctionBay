import { AuthGuard } from "@nestjs/passport";
//namesto pisanja @UseGuards(AuthGuard('jwt')) v user.controller (string je error-prone) 
export class JwtGuard extends AuthGuard('jwt'){
    constructor(){
        super()
    }
}