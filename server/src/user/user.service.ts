import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ForgotPasswordDto, VerifyCodeDto, createUserDto, toggleBanUserDto, updatePasswordDto, updateProfileDto, updateUserDto } from './dto';
import { PAGE_SIZE, ResponseData, USER_TYPES } from '../global';
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

    async getAllUser(option: { page: number, key: string, isBan: string, schoolId: number }) {
        const pageSize = PAGE_SIZE.PAGE_USER
        try {
            let { key, page, isBan, schoolId } = option
            let whereCondition: any = {
                type: USER_TYPES.USER
            }
            if (key) {
                whereCondition.OR = [{
                    name: {
                        contains: key,
                        mode: 'insensitive'
                    }
                }, {
                    email: {
                        contains: key,
                        mode: 'insensitive'
                    }
                }]
            }
            if (isBan !== undefined && isBan !== null) {
                whereCondition.isBan = isBan == 'true' ? true : false
            }
            if (schoolId) whereCondition.schoolId = Number(schoolId)
            const totalCount = await this.prismaService.user.count({
                where: whereCondition,
            })
            let totalPages = Math.ceil(totalCount / pageSize)
            if (!totalPages) totalPages = 1
            if (!page || page < 1) page = 1
            let next = (page - 1) * pageSize
            const data = await this.prismaService.user.findMany({
                where: whereCondition,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    isBan: true,
                    createdAt: true,
                    Feedback: true,
                    schoolId: true,
                    School: true
                },
                orderBy: {
                    id: 'asc'
                },
                skip: next,
                take: pageSize
            })
            return new ResponseData<any>({ data, totalPages }, 200, 'Tìm thành công các tài khoản')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async createUser(createUserDto: createUserDto) {
        try {
            const user = await this.prismaService.user.findFirst({
                where: {
                    email: createUserDto.email
                }
            })
            if (user) return new ResponseData<User>(null, 400, 'Email đã được sử dụng')
            const hashedPassword = await argon2.hash(createUserDto.password)
            await this.prismaService.user.create({
                data: {
                    email: createUserDto.email,
                    password: hashedPassword,
                    name: createUserDto.name,
                    schoolId: createUserDto.schoolId
                }
            })
            return new ResponseData<User>(null, 200, 'Tạo tài khoản thành công')
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

    async updateProfile(userId: number, updateProfileDto: updateProfileDto) {
        try {
            const user = await this.getUserById(userId)
            if (!user) new ResponseData<User>(null, 400, 'Tài khoản không tồn tại')
            await this.prismaService.user.update({
                where: {
                    id: user.id
                },
                data: {
                    ...updateProfileDto
                }
            })
            return new ResponseData<any>(null, 200, 'Cập nhật thông tin thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async updateAvatar(userId: number, image: Express.Multer.File) {
        try {
            const user = await this.getUserById(userId)
            if (!user) new ResponseData<User>(null, 400, 'Tài khoản không tồn tại')
            const img = await this.cloudinaryService.uploadFile(image)
            await this.prismaService.user.update({
                where: {
                    id: user.id
                },
                data: {
                    image: img.url
                }
            })
            return new ResponseData<any>(null, 200, 'Cập nhật thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async updateUser(userId: number, updateUserDto: updateUserDto, image: Express.Multer.File) {
        try {
            const data: { name?: string, image?: string, password?: string, schoolId?: number } = {}
            const user = await this.getUserById(userId)
            if (!user) new ResponseData<User>(null, 400, 'Tài khoản không tồn tại')
            if (updateUserDto.name) {
                data.name = updateUserDto.name
            }
            if (updateUserDto.newPassword) {
                const hashedPassword = await argon2.hash(updateUserDto.newPassword)
                data.password = hashedPassword
            }
            if (image) {
                const img = await this.cloudinaryService.uploadFile(image)
                data.image = img.url
            }
            if (updateUserDto.schoolId) {
                data.schoolId = updateUserDto.schoolId
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
            if (!user) {
                new ResponseData<User>(null, 400, 'Tài khoản không tồn tại')
            }
            const passwordMatched = await argon2.verify(user.password, updatePasswordDto.currentPassword)
            if (!passwordMatched) {
                return new ResponseData<string>(null, 400, 'Mật khẩu không chính xác')
            }
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
