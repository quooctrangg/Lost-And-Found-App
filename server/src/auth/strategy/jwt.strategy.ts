import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { Strategy, ExtractJwt } from "passport-jwt"
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly configService: ConfigService, private readonly prismaService: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET')
        })
    }

    async validate(payload: { sub: number, studentId: string }) {
        const user = await this.prismaService.user.findFirst({
            where: {
                id: payload.sub,
                studentId: payload.studentId
            },
            include: {
                Major: {
                    include: {
                        School: true
                    }
                },
                Post: {
                    where: {
                        isDelete: false
                    }
                }
            }
        })
        if (!user) return
        delete user.password
        return user
    }
}
