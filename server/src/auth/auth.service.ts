import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto';
import { ResponseData } from '../global';

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService, private readonly jwtService: JwtService, private readonly configService: ConfigService, private readonly mailerService: MailerService) { }

    async login(loginDto: LoginDto) {
        try {
            const user = await this.prismaService.user.findFirst({
                where: {
                    studentId: loginDto.studentId.toLowerCase()
                },
                include: {
                    Feedback: {
                        orderBy: {
                            createdAt: 'desc'
                        }
                    }
                }
            })
            if (!user) return new ResponseData<string>(null, 400, 'Tài khoản không tồn tại')
            if (user.type == -1) {
                return new ResponseData<string>(null, 400, 'Tài khoản chưa được xác thực')
            }
            const passwordMatched = await argon2.verify(user.password, loginDto.password)
            if (!passwordMatched) {
                return new ResponseData<string>(null, 400, 'Mật khẩu không chính xác')
            }
            if (user.isBan) {
                return new ResponseData<any>({ feedback: user.Feedback[0] }, 403, 'Tài khoản đã bị khóa')
            }
            const data = await this.signJwtToken(user.id, user.studentId)
            return new ResponseData<any>(data, 200, 'Đăng nhập thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async signJwtToken(userId: number, studentId: string) {
        const payload = {
            sub: userId,
            studentId: studentId
        }
        const jwtString = await this.jwtService.signAsync(payload, {
            expiresIn: this.configService.get('JWT_EXPIRES_LOGIN'),
            secret: this.configService.get('JWT_SECRET')
        })
        return {
            accessToken: jwtString
        }
    }

    random6DigitNumber() {
        const randomNumber = Math.floor(Math.random() * 1000000);
        const paddedNumber = randomNumber.toString().padStart(6, '0');
        return paddedNumber;
    }
}
