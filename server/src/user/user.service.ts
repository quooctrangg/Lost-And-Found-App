import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ForgotPasswordDto, VerifyCodeDto, CreateUserDto, BanUserDto, UpdatePasswordDto, UpdateProfileDto, UpdateUserDto } from './dto';
import { PAGE_SIZE, ResponseData, USER_TYPES } from '../global';
import { User } from '@prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import * as argon2 from 'argon2';
import { MailerService } from '@nestjs-modules/mailer';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService, private readonly cloudinaryService: CloudinaryService, private readonly mailerService: MailerService) { }

    private readonly logger = new Logger(UserService.name);

    async getUser(user: User) {
        try {
            return new ResponseData<User>(user, 200, 'Tài khoản tồn tại')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async getProfileUser(id: number) {
        try {
            const user = await this.prismaService.user.findUnique({
                where: {
                    id: id
                },
                include: {
                    Post: true,
                    Major: true
                }
            })
            if (!user) {
                return new ResponseData<User>(null, 400, 'Tài khoản không tồn tại')
            }
            delete user.password
            delete user.type
            delete user.updatedAt
            return new ResponseData<User>(user, 200, 'Tài khoản tồn tại')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async getAllUser(option: { page: number, key: string, isBan: string, schoolId: number, majorId: number }) {
        const pageSize = PAGE_SIZE.PAGE_USER
        try {
            let { key, page, isBan, schoolId, majorId } = option
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
            if (schoolId) {
                whereCondition.AND = [
                    {
                        Major: {
                            schoolId: Number(schoolId)
                        }
                    }
                ]
                if (majorId) {
                    whereCondition.AND.push({ majorId: Number(majorId) })
                }
            }
            if (isBan !== undefined && isBan !== null) {
                whereCondition.isBan = isBan == 'true' ? true : false
            }
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
                    Major: {
                        include: {
                            School: true
                        }
                    }
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

    async createUser(createUserDto: CreateUserDto) {
        try {
            const user = await this.prismaService.user.findFirst({
                where: {
                    email: createUserDto.email.toLowerCase()
                }
            })
            if (user) {
                return new ResponseData<User>(null, 400, 'Email đã được sử dụng')
            }
            const hashedPassword = await argon2.hash(createUserDto.password)
            await this.prismaService.user.create({
                data: {
                    email: createUserDto.email.toLowerCase(),
                    password: hashedPassword,
                    name: createUserDto.name,
                    majorId: createUserDto.majorId,
                    type: 1
                }
            })
            return new ResponseData<User>(null, 200, 'Tạo tài khoản thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async unBanUser(userId: number) {
        try {
            const user = await this.getUserById(userId)
            if (!user) {
                return new ResponseData<User>(null, 400, 'Tài khoản không tồn tại')
            }
            if (!user.isBan) {
                return new ResponseData<string>(null, 400, 'Tài khoản không bị khóa')
            }
            await this.prismaService.user.update({
                where: {
                    id: user.id
                },
                data: {
                    isBan: false,
                    banUntil: null
                }
            })
            return new ResponseData<any>(null, 200, 'Mở khóa người dùng thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async banUser(userId: number, banUserDto: BanUserDto) {
        const now = new Date()
        try {
            const user = await this.getUserById(userId)
            if (!user) {
                return new ResponseData<User>(null, 400, 'Tài khoản không tồn tại')
            }
            if (user.isBan) {
                return new ResponseData<string>(null, 400, 'Tài khoản đang bị khóa')
            }
            await this.prismaService.feedback.create({
                data: {
                    content: banUserDto.feedback,
                    userId: user.id,
                    time: banUserDto.time
                }
            })
            let lockUntil: Date = null
            if (banUserDto.time && banUserDto.time != -1) {
                lockUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000 * banUserDto.time)
            }
            await this.prismaService.user.update({
                where: {
                    id: userId
                },
                data: {
                    isBan: true,
                    banUntil: lockUntil
                }
            })
            return new ResponseData<string>(null, 200, 'Khóa tài khoản thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
        try {
            const user = await this.getUserById(userId)
            if (!user) {
                return new ResponseData<User>(null, 400, 'Tài khoản không tồn tại')
            }
            await this.prismaService.user.update({
                where: {
                    id: user.id
                },
                data: {
                    name: updateProfileDto.name,
                    majorId: updateProfileDto.majorId
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
            if (!user) {
                return new ResponseData<User>(null, 400, 'Tài khoản không tồn tại')
            }
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

    async updateUser(userId: number, updateUserDto: UpdateUserDto, image: Express.Multer.File) {
        try {
            const data: { name?: string, image?: string, password?: string, majorId?: number } = {}
            const user = await this.getUserById(userId)
            if (!user) {
                return new ResponseData<User>(null, 400, 'Tài khoản không tồn tại')
            }
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
            if (updateUserDto.majorId) {
                data.majorId = updateUserDto.majorId
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

    async updatePassword(id: number, updatePasswordDto: UpdatePasswordDto) {
        try {
            const user = await this.getUserById(id)
            if (!user) {
                return new ResponseData<User>(null, 400, 'Tài khoản không tồn tại')
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
            if (!verifyCode) {
                return new ResponseData<string>(null, 400, 'Mã xác minh không tồn tại')
            }
            const createdAt = new Date(verifyCode.createdAt)
            createdAt.setMinutes(createdAt.getMinutes() + 5)
            if (createdAt <= currentDate) {
                return new ResponseData<string>(null, 400, 'Quá thời gian của mã xác minh')
            }
            const user = await this.prismaService.user.findFirst({
                where: {
                    email: forgotPasswordDto.email
                }
            })
            if (!user) {
                return new ResponseData<string>(null, 400, 'Tài khoản không tồn tại')
            }
            const hashedPassword = await argon2.hash(forgotPasswordDto.newPassword)
            const newPassword = await this.prismaService.user.update({
                where: {
                    id: user.id
                },
                data: {
                    password: hashedPassword
                }
            })
            if (!newPassword) {
                return new ResponseData<string>(null, 400, 'Đổi mật khẩu thất bại, thử lại')
            }
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
            if (!user) {
                return new ResponseData<any>(null, 400, 'Email này chưa đăng ký')
            }
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
            if (!verifyCode) {
                return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
            }
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

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async autoUnBan() {
        try {
            await this.prismaService.user.updateMany({
                where: {
                    isBan: true,
                    banUntil: {
                        lte: new Date()
                    }
                },
                data: {
                    isBan: false,
                    banUntil: null
                }
            })
            this.logger.log('Mở khóa thành công các tài khoản bị khóa')
        } catch (error) {
            this.logger.error(error.message)
        }
    }

    async autoBan() {
        try {

        } catch (error) {
            this.logger.error(error.message)
        }
    }

    async getUserById(id: number) {
        return await this.prismaService.user.findUnique({
            where: {
                id: id
            }
        })
    }

    random6DigitNumber() {
        const randomNumber = Math.floor(Math.random() * 1000000);
        const paddedNumber = randomNumber.toString().padStart(6, '0');
        return paddedNumber;
    }
}
