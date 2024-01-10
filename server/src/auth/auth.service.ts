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
            const user = await this.prismaService.user.findFirst({
                where: { email: registerDto.email }
            })
            if (user) return new ResponseData<User>(null, 400, 'Email đã được sử dụng')
            const hashedPassword = await argon2.hash(registerDto.password)
            const newuser = await this.prismaService.user.create({
                data: {
                    email: registerDto.email,
                    name: registerDto.name,
                    password: hashedPassword
                }
            })
            if (!newuser) return new ResponseData<User>(null, 400, 'Tạo tài khoản thất bại, thử lại')
            await this.prismaService.verifyCode.deleteMany({
                where: { email: registerDto.email }
            })
            delete newuser.password
            delete newuser.isBan
            return new ResponseData<User>(newuser, 200, 'Tạo tài khoản thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async login(loginDto: LoginDto) {
        try {
            const user = await this.prismaService.user.findFirst({
                where: { email: loginDto.email }
            })
            if (!user) return new ResponseData<string>(null, 400, 'Tài khoản không tồn tại')
            const passwordMatched = await argon2.verify(user.password, loginDto.password)
            if (!passwordMatched) return new ResponseData<string>(null, 400, 'Mật khẩu không chính xác')
            // if (user.isBan) return new ResponseData<any>({ feedback: user.feedback }, 403, 'Tài khoản đã bị khóa')
            const data = await this.signJwtToken(user.id, user.email)
            return new ResponseData<any>(data, 200, 'Đăng nhập thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async sendVerifyCode(verifyCodeDto: VerifyCodeDto) {
        try {
            const { email } = verifyCodeDto
            const user = await this.prismaService.user.findFirst({ where: { email }, })
            if (!user) return new ResponseData<any>(null, 400, 'Email này chưa đăng ký')
            await this.prismaService.verifyCode.deleteMany({ where: { email: email } })
            const code = this.random6DigitNumber()
            const verifyCode = await this.prismaService.verifyCode.create({
                data: {
                    email: verifyCodeDto.email,
                    code: parseInt(code)
                }
            })
            if (!verifyCode) return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
            const emailSend = await this.mailerService.sendMail({
                to: email,
                subject: 'Mã OTP để xác nhận tạo tào khoản mới cho Ứng dụng hỗ trợ tìm kiếm đồ vật bị thất lạt',
                template: './verifycode',
                context: {
                    name: user.name,
                    code: code
                }
            })
            if (!emailSend) return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
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
