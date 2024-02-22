import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { ConfirmEmailDto, LoginDto, RegisterDto } from './dto';
import { ResponseData } from '../global';

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService, private readonly jwtService: JwtService, private readonly configService: ConfigService, private readonly mailerService: MailerService) { }

    async register(registerDto: RegisterDto) {
        try {
            const isEmail = this.validateEmail(registerDto.email)
            if (!isEmail) {
                return new ResponseData<User>(null, 400, 'Email không đúng định dạng')
            }
            const user = await this.prismaService.user.findFirst({
                where: {
                    email: registerDto.email
                }
            })
            if (user && user.type !== -1) return new ResponseData<User>(null, 400, 'Email đã được sử dụng')
            await this.prismaService.user.deleteMany({
                where: {
                    email: registerDto.email
                }
            })
            const hashedPassword = await argon2.hash(registerDto.password)
            await this.prismaService.user.create({
                data: {
                    email: registerDto.email,
                    name: registerDto.name,
                    password: hashedPassword,
                    schoolId: registerDto.schoolId
                }
            })
            await this.sendVerificationLink(registerDto.email)
            return new ResponseData<User>(null, 200, 'Vui lòng mở email để xác nhận tài khoản')
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
            const data = await this.signJwtToken(user.id, user.email)
            return new ResponseData<any>(data, 200, 'Đăng nhập thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async confirm(confirmEmailDto: ConfirmEmailDto) {
        try {
            let data: any = null
            try {
                data = await this.jwtService.verifyAsync(confirmEmailDto.token, {
                    secret: this.configService.get('JWT_SECRET')
                })
            } catch (error) {
                return new ResponseData<string>(null, 400, 'Đã hết thời gian xác nhận tài khoản')
            }
            const user = await this.prismaService.user.findFirst({
                where: {
                    email: data.email,
                    type: -1
                }
            })
            if (!user) {
                return new ResponseData<string>(null, 400, 'Tài khoản không tồn tại')
            }
            await this.prismaService.user.update({
                where: {
                    id: user.id
                },
                data: {
                    type: 1
                }
            })
            return new ResponseData<string>(null, 200, 'Xác nhận tài khoản thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async sendVerificationLink(email: string) {
        const payload = {
            email: email
        }
        const token = await this.jwtService.signAsync(payload, {
            expiresIn: this.configService.get('JWT_EXPIRES_VERIFY'),
            secret: this.configService.get('JWT_SECRET')
        })
        const url = `${this.configService.get('CLIENT_URL')}/confirm?token=${token}`
        return this.mailerService.sendMail({
            to: email,
            subject: 'Xác nhận tài khoản ứng dụng',
            template: './verificationLink',
            context: {
                url: url
            }
        })
    }

    async signJwtToken(userId: number, email: string) {
        const payload = {
            sub: userId,
            email: email
        }
        const jwtString = await this.jwtService.signAsync(payload, {
            expiresIn: this.configService.get('JWT_EXPIRES_LOGIN'),
            secret: this.configService.get('JWT_SECRET')
        })
        return {
            accessToken: jwtString
        }
    }

    validateEmail(email: string) {
        const regex = /^[a-zA-Z0-9+_.-]+B\d{7}@student\.ctu\.edu\.vn$/i
        return regex.test(email);
    }

    random6DigitNumber() {
        const randomNumber = Math.floor(Math.random() * 1000000);
        const paddedNumber = randomNumber.toString().padStart(6, '0');
        return paddedNumber;
    }
}
