import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { Strategy, ExtractJwt } from "passport-jwt"
import { PrismaService } from "../../prisma/prisma.service";
import { ResponseData } from "../../global";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private configService: ConfigService, private prismaService: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET')
        })
    }

    async validate(payload: { sub: number, username: string }) {
        // const user = await this.prismaService.User.findFirst({
        //     where: { userId: payload.sub },
        //     include: { User: true }
        // })

        // if (!user) return
        // delete user.password
        // return user
    }
}
