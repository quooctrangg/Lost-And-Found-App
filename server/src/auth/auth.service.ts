import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto, VerifyCodeDto } from './dto';
import { ResponseData } from '../global';

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService, private readonly jwtService: JwtService, private readonly configService: ConfigService, private readonly mailerService: MailerService) { }

    async register(registerDto: RegisterDto) {
        const currentDate = new Date();
        try {
            const user = await this.prismaService.user.findFirst({
                where: {
                    email: registerDto.email
                }
            })
            if (user) return new ResponseData<User>(null, 400, 'Email đã được sử dụng')
            const verifyCode = await this.prismaService.verifyCode.findFirst({
                where: {
                    email: registerDto.email,
                    code: registerDto.code
                }
            })
            if (!verifyCode) return new ResponseData<string>(null, 400, 'Mã xác minh không tồn tại')
            const createdAt = new Date(verifyCode.createdAt)
            createdAt.setMinutes(createdAt.getMinutes() + 5)
            if (createdAt <= currentDate) return new ResponseData<string>(null, 400, 'Quá thời gian của mã xác minh')
            const hashedPassword = await argon2.hash(registerDto.password)
            await this.prismaService.user.create({
                data: {
                    email: registerDto.email,
                    name: registerDto.name,
                    password: hashedPassword,
                    schoolId: registerDto.schoolId
                }
            })
            await this.prismaService.verifyCode.deleteMany({
                where: {
                    email: registerDto.email
                }
            })
            return new ResponseData<User>(null, 200, 'Tạo tài khoản thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async login(loginDto: LoginDto) {
        try {
            const user = await this.prismaService.user.findFirst({
                where: {
                    email: loginDto.email
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
            const passwordMatched = await argon2.verify(user.password, loginDto.password)
            if (!passwordMatched) return new ResponseData<string>(null, 400, 'Mật khẩu không chính xác')
            if (user.isBan) return new ResponseData<any>({ feedback: user.Feedback[0] }, 403, 'Tài khoản đã bị khóa')
            const data = await this.signJwtToken(user.id, user.email)
            return new ResponseData<any>(data, 200, 'Đăng nhập thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async sendVerifyCode(verifyCodeDto: VerifyCodeDto) {
        try {
            await this.prismaService.verifyCode.deleteMany({
                where: {
                    email: verifyCodeDto.email
                }
            })
            const code = this.random6DigitNumber()
            const verifyCode = await this.prismaService.verifyCode.create({
                data: {
                    email: verifyCodeDto.email,
                    code: parseInt(code)
                }
            })
            if (!verifyCode) return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
            await this.mailerService.sendMail({
                to: verifyCodeDto.email,
                subject: 'Mã OTP để xác nhận tạo tài khoản mới cho Ứng dụng hỗ trợ tìm kiếm đồ vật bị thất lạc',
                template: './verifycode',
                context: {
                    name: verifyCodeDto.name,
                    code: code
                }
            })
            return new ResponseData<string>(null, 200, 'Gửi mã thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async signJwtToken(userId: number, email: string) {
        const payload = {
            sub: userId,
            email: email
        }
        const jwtString = await this.jwtService.signAsync(payload, {
            expiresIn: '24h',
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
