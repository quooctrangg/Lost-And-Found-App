import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MajorService } from '../major/major.service';
import { ForgotPasswordDto, VerifyCodeDto, CreateUserDto, BanUserDto, UpdatePasswordDto, UpdateUserDto } from './dto';
import { PAGE_SIZE, ResponseData, USER_TYPES } from '../global';
import { User } from '@prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Workbook } from 'exceljs'
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService, private readonly cloudinaryService: CloudinaryService, private readonly mailerService: MailerService, private readonly majorService: MajorService) { }

    private readonly logger = new Logger(UserService.name);

    async getUser(user: User) {
        try {
            return new ResponseData<User>(user, 200, 'Tài khoản tồn tại')
        } catch (error) {
            this.logger.error(error.message)
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
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async getAllUser(option: { page: number, key: string, isBan: string, schoolId: number, majorId: number, type: number }) {
        const pageSize = PAGE_SIZE.PAGE_USER
        try {
            let { key, page, isBan, schoolId, majorId, type } = option
            let whereCondition: any = {
                type: {
                    not: USER_TYPES.ADMIN
                }
            }
            if (key) {
                whereCondition.OR = [{
                    name: {
                        contains: key,
                        mode: 'insensitive'
                    }
                }, {
                    studentId: {
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
            if (type && Number(type) !== 0) {
                whereCondition.type = Number(type)
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
                    studentId: true,
                    image: true,
                    isBan: true,
                    createdAt: true,
                    Feedback: true,
                    Major: {
                        include: {
                            School: true
                        }
                    },
                    type: true
                },
                orderBy: {
                    id: 'asc'
                },
                skip: next,
                take: pageSize
            })
            return new ResponseData<any>({ data, totalPages, totalCount }, 200, 'Tìm thành công các tài khoản')
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async createUser(createUserDto: CreateUserDto) {
        try {
            const user = await this.prismaService.user.findFirst({
                where: {
                    studentId: createUserDto.studentId.toLowerCase()
                }
            })
            if (user) {
                return new ResponseData<User>(null, 400, 'Mã số sinh viên đã được sử dụng')
            }
            const hashedPassword = await argon2.hash(createUserDto.password)
            await this.prismaService.user.create({
                data: {
                    studentId: createUserDto.studentId.toLowerCase(),
                    password: hashedPassword,
                    name: createUserDto.name,
                    majorId: createUserDto.majorId
                }
            })
            return new ResponseData<User>(null, 200, 'Tạo tài khoản thành công')
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async createUsers(file: Express.Multer.File) {
        const keys = ['studentId', 'name', 'password', 'majorId']
        const data = [];
        const userError = []
        let objects: any[]
        try {
            const workbook = new Workbook();
            await workbook.xlsx.load(file.buffer);
            const worksheet = workbook.getWorksheet(1);
            const keysworksheet = worksheet.getRow(1).values
            const isEqual = keys.every((key, index) => key === keysworksheet[index + 1]);
            if (!isEqual) {
                return new ResponseData<string>(null, 400, 'Không đúng định dạng dữ liệu')
            }
            worksheet.eachRow((row, i) => {
                if (i !== 1) {
                    data.push(row.values);
                }
            });
            objects = data.map(row => {
                const obj = {};
                for (let i = 1; i < row.length; i++) {
                    obj[keys[i - 1]] = row[i];
                }
                return obj;
            });
            for (let index = 0; index < objects.length; index++) {
                const isStudentId = await this.isStudentId(String(objects[index].studentId).toLowerCase())
                const isMajor = await this.majorService.isMajor(Number(objects[index].majorId))
                if (isStudentId || !isMajor || String(objects[index].password).length < 6) {
                    userError.push(objects[index])
                } else {
                    const hashedPassword = await argon2.hash(String(objects[index].password))
                    await this.prismaService.user.create({
                        data: {
                            studentId: String(objects[index].studentId).toLowerCase(),
                            name: String(objects[index].name),
                            password: hashedPassword,
                            majorId: Number(objects[index].majorId)
                        }
                    })
                }
            }
            return new ResponseData<any>({ userError, totalSuccess: objects.length - userError.length, totalError: userError.length }, 200, 'Tạo tài khoản thành công')
        } catch (error) {
            this.logger.error(error.message)
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
            this.logger.error(error.message)
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
            this.logger.error(error.message)
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
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async updateUser(userId: number, updateUserDto: UpdateUserDto, image: Express.Multer.File) {
        try {
            const data: { name?: string, image?: string, password?: string, majorId?: number, type?: number } = {}
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
            if (updateUserDto.type == 2 || updateUserDto.type == 1) {
                data.type = updateUserDto.type
            }
            await this.prismaService.user.update({
                where: {
                    id: user.id
                },
                data: data
            })
            return new ResponseData<any>(null, 200, 'Cập nhật thông tin thành công')
        } catch (error) {
            this.logger.error(error.message)
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
            if (updatePasswordDto.currentPassword == updatePasswordDto.newPassword) {
                return new ResponseData<string>(null, 400, 'Mật khẩu mới giống mật khẩu cũ')
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
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        const currentDate = new Date();
        try {
            const verifyCode = await this.prismaService.verifyCode.findFirst({
                where: {
                    studentId: forgotPasswordDto.studentId.toLowerCase(),
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
                    studentId: forgotPasswordDto.studentId.toLowerCase()
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
                    studentId: user.studentId.toLowerCase()
                }
            })
            return new ResponseData<string>(null, 200, 'Đổi mật khẩu thành công')
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async sendVerifyCode(verifyCodeDto: VerifyCodeDto) {
        try {
            const user = await this.prismaService.user.findFirst({
                where: {
                    studentId: verifyCodeDto.studentId.toLowerCase()
                }
            })
            if (!user) {
                return new ResponseData<any>(null, 400, 'Mã số sinh viên chưa đăng ký')
            }
            await this.prismaService.verifyCode.deleteMany({
                where: {
                    studentId: user.studentId.toLowerCase()
                }
            })
            const code = this.random6DigitNumber()
            await this.prismaService.verifyCode.create({
                data: {
                    studentId: user.studentId.toLowerCase(),
                    code: parseInt(code)
                }
            })
            const email = this.getEmail(user)
            await this.mailerService.sendMail({
                to: email,
                subject: 'Mã OTP để xác nhận đổi mật khẩu tài khoản cho Ứng dụng hỗ trợ tìm kiếm đồ vật bị thất lạc',
                template: './verifycode',
                context: {
                    name: user.name,
                    code: code
                }
            })
            return new ResponseData<string>(null, 200, 'Gửi mã thành công')
        } catch (error) {
            this.logger.error(error.message)
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

    @Cron('0 0 1 2,8 *')
    async autoBan() {
        const currentMonth = new Date().getMonth() + 1
        const currentYear = new Date().getFullYear() % 100
        try {
            const data = await this.prismaService.user.findMany({
                where: {
                    type: USER_TYPES.USER,
                },
                select: {
                    id: true,
                    studentId: true,
                    Major: {
                        select: {
                            trainingDuration: true
                        }
                    }
                }
            })
            const filter = data.map((e) => {
                return { id: e.id, year: Number(e.studentId.match(/b(\d{2})/)[1]) + e.Major.trainingDuration }
            })
            switch (currentMonth) {
                case 8:
                    await filter.forEach(async e => {
                        if (e.year <= currentYear) {
                            await this.prismaService.user.update({
                                where: {
                                    id: e.id
                                },
                                data: {
                                    isBan: true
                                }
                            })
                            await this.prismaService.feedback.create({
                                data: {
                                    userId: e.id,
                                    content: 'Tài khoản của bạn đã bị khóa do đã hết thời gian trương trình đào tạo.',
                                    time: -1
                                }
                            })
                        }
                    })
                    break;
                case 2:
                    await filter.forEach(async e => {
                        if (e.year <= currentYear - 0.5) {
                            await this.prismaService.user.update({
                                where: {
                                    id: e.id
                                },
                                data: {
                                    isBan: true
                                }
                            })
                            await this.prismaService.feedback.create({
                                data: {
                                    userId: e.id,
                                    content: 'Tài khoản của bạn đã bị khóa do đã hết thời gian trương trình đào tạo.',
                                    time: -1
                                }
                            })
                        }
                    })
                    break;
            }
            this.logger.log('Đã khóa các tài khoản hết thời gian chương trình đạo tạo.')
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

    async isStudentId(studentId: string) {
        const user = await this.prismaService.user.findFirst({
            where: {
                studentId: studentId
            }
        })
        return user ? true : false
    }

    getEmail(user: User) {
        const nameParts = user.name.split(' ')
        const lastName = nameParts[nameParts.length - 1];
        const normalizedLastName = lastName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        return normalizedLastName + user.studentId + '@student.ctu.edu.vn'
    }

    random6DigitNumber() {
        const randomNumber = Math.floor(Math.random() * 1000000);
        const paddedNumber = randomNumber.toString().padStart(6, '0');
        return paddedNumber;
    }
}
