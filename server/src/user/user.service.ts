import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ForgotPasswordDto, VerifyCodeDto, toggleBanUserDto, updatePasswordDto, updateProfileDto, updateUserDto } from './dto';
import { ResponseData, USER_TYPES } from '../global';
import { User } from '@prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import * as argon2 from 'argon2';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService, private readonly cloudinaryService: CloudinaryService, private readonly mailerService: MailerService) { }

    async getUser(id: number) {
        try {
            const user = await this.getUserById(id)
            delete user.password
            return new ResponseData<User>(user, 200, 'Tài khoản tồn tại')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async getAllUser() {
        try {
            const users = await this.prismaService.user.findMany({
                where: {
                    type: USER_TYPES.USER
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    isBan: true,
                    createdAt: true,
                    Feedback: true
                }
            })
            return new ResponseData<any>(users, 200, 'Tìm thành công các tài khoản')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async toggleBanUser(userId: number, toggleBanUserDto: toggleBanUserDto) {
        try {
            const user = await this.getUserById(userId)
            if (!user) new ResponseData<User>(null, 400, 'Tài khoản không tồn tại')
            if (!user.isBan) await this.prismaService.feedback.create({
                data: {
                    content: toggleBanUserDto.feedback,
                    userId: user.id
                }
            })
            await this.prismaService.user.update({
                where: {
                    id: user.id
                },
                data: {
                    isBan: !user.isBan
                }
            })
            if (!user.isBan) return new ResponseData<any>(null, 200, 'Khóa người dùng thành công')
            return new ResponseData<any>(null, 200, 'Mở khóa người dùng thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async updateProfile(userId: number, updateProfileDto: updateProfileDto, image: Express.Multer.File) {
        try {
            const data: { name?: string, image?: string } = { ...updateProfileDto }
            const user = await this.getUserById(userId)
            if (!user) new ResponseData<User>(null, 400, 'Tài khoản không tồn tại')
            if (image) {
                const img = await this.cloudinaryService.uploadFile(image)
                data.image = img.url
            }
            await this.prismaService.user.update({
                where: {
                    id: user.id
                },
                data: data
            })
            return new ResponseData<any>(null, 200, 'Cập nhật thông tin thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async updateUser(userId: number, updateUserDto: updateUserDto, image: Express.Multer.File) {
        try {
            const data: { name?: string, image?: string, passwrod?: string } = {}
            const user = await this.getUserById(userId)
            if (!user) new ResponseData<User>(null, 400, 'Tài khoản không tồn tại')
            if (updateUserDto.name) {
                data.name = updateUserDto.name
            }
            if (updateUserDto.newPassword) {
                const hashedPassword = await argon2.hash(updateUserDto.newPassword)
                data.passwrod = hashedPassword
            }
            if (image) {
                const img = await this.cloudinaryService.uploadFile(image)
                data.image = img.url
            }
            await this.prismaService.user.update({
                where: {
                    id: user.id
                },
                data: data
            })
            return new ResponseData<any>(null, 200, 'Cập nhật thông tin thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async updatePassword(id: number, updatePasswordDto: updatePasswordDto) {
        try {
            const user = await this.getUserById(id)
            if (!user) new ResponseData<User>(null, 400, 'Tài khoản không tồn tại')
            const passwordMatched = await argon2.verify(user.password, updatePasswordDto.currentPassword)
            if (!passwordMatched) return new ResponseData<string>(null, 400, 'Mật khẩu không chính xác')
            const hashedPassword = await argon2.hash(updatePasswordDto.newPassword)
            await this.prismaService.user.update({
                where: {
                    id: user.id
                },
                data: {
                    password: hashedPassword
                }
            })
            return new ResponseData<any>(null, 200, 'Cập nhật mật khẩu thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        const currentDate = new Date();
        try {
            const verifyCode = await this.prismaService.verifyCode.findFirst({
                where: {
                    email: forgotPasswordDto.email,
                    code: forgotPasswordDto.code
                }
            })
            if (!verifyCode) return new ResponseData<string>(null, 400, 'Mã xác minh không tồn tại')
            const createdAt = new Date(verifyCode.createdAt)
            createdAt.setMinutes(createdAt.getMinutes() + 5)
            if (createdAt <= currentDate) return new ResponseData<string>(null, 400, 'Quá thời gian của mã xác minh')
            const user = await this.prismaService.user.findFirst({
                where: {
                    email: forgotPasswordDto.email
                }
            })
            if (!user) return new ResponseData<string>(null, 400, 'Tài khoản không tồn tại')
            const hashedPassword = await argon2.hash(forgotPasswordDto.newPassword)
            const newPassword = await this.prismaService.user.update({
                where: {
                    id: user.id
                },
                data: {
                    password: hashedPassword
                }
            })
            if (!newPassword) return new ResponseData<string>(null, 400, 'Đổi mật khẩu thất bại, thử lại')
            await this.prismaService.verifyCode.deleteMany({
                where: {
                    email: user.email
                }
            })
            return new ResponseData<string>(null, 200, 'Đổi mật khẩu thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async sendVerifyCode(verifyCodeDto: VerifyCodeDto) {
        try {
            const user = await this.prismaService.user.findFirst({
                where: {
                    email: verifyCodeDto.email
                }
            })
            if (!user) return new ResponseData<any>(null, 400, 'Email này chưa đăng ký')
            await this.prismaService.verifyCode.deleteMany({
                where: {
                    email: user.email
                }
            })
            const code = this.random6DigitNumber()
            const verifyCode = await this.prismaService.verifyCode.create({
                data: {
                    email: user.email,
                    code: parseInt(code)
                }
            })
            if (!verifyCode) return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
            await this.mailerService.sendMail({
                to: user.email,
                subject: 'Mã OTP để xác nhận đổi mật khẩu tài khoản cho Ứng dụng hỗ trợ tìm kiếm đồ vật bị thất lạc',
                template: './verifycode',
                context: {
                    name: user.name,
                    code: code
                }
            })
            return new ResponseData<string>(null, 200, 'Gửi mã thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async getUserById(id: number) {
        return await this.prismaService.user.findUnique({
            where: {
                id: id
            },
            include: {
                School: true,
                Post: true
            }
        })
    }

    random6DigitNumber() {
        const randomNumber = Math.floor(Math.random() * 1000000);
        const paddedNumber = randomNumber.toString().padStart(6, '0');
        return paddedNumber;
    }
}
