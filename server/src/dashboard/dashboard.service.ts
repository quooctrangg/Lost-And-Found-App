import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseData } from '../global';
import { Workbook } from 'exceljs'
import { join } from 'path';
import * as moment from 'moment-timezone';

@Injectable()
export class DashboardService {
    constructor(private readonly prismaService: PrismaService) { }

    private readonly logger = new Logger(DashboardService.name);

    async getStatistical(option: { type: string, month: string, year: string, to: string, from: string }) {
        let start: any
        let end: any
        try {
            const { type, month, year, to, from } = option
            switch (type) {
                case 'month':
                    start = new Date(Number(year), Number(month) - 1, 1)
                    end = new Date(Number(year), Number(month), 0);
                    break;
                case 'year':
                    start = new Date(Number(year), 0, 1)
                    end = new Date(Number(year), 12, 0)
                    break;
                case 'any':
                    const startDate = moment.tz(to, 'Asia/Ho_Chi_Minh');
                    const endDate = moment.tz(from, 'Asia/Ho_Chi_Minh').endOf('day');
                    start = new Date(startDate.clone().utc().format())
                    end = new Date(endDate.clone().utc().format())
                    break;
            }
            const user = await this.prismaService.user.count({
                where: {
                    type: {
                        not: 0
                    },
                    createdAt: {
                        gte: start,
                        lte: end
                    }
                }
            })
            const post = await this.prismaService.post.count({
                where: {
                    verify: 1,
                    isDelete: false,
                    updatedAt: {
                        gte: start,
                        lte: end
                    }
                }
            })
            const request = await this.prismaService.request.count({
                where: {
                    createdAt: {
                        gte: start,
                        lte: end
                    }
                }
            })
            const done = await this.prismaService.post.count({
                where: {
                    done: {
                        not: 0
                    },
                    isDelete: false,
                    verify: 1,
                    updatedAt: {
                        gte: start,
                        lte: end
                    }
                }
            })
            return new ResponseData<any>({ user, post, request, done }, 200, 'Thống kê thành công')
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async getChart(option: { type: string, month: string, year: string, to: string, from: string }) {
        let start: any
        let end: any
        try {
            const { type, month, year, to, from } = option
            switch (type) {
                case 'month':
                    start = new Date(Number(year), Number(month) - 1, 1)
                    end = new Date(Number(year), Number(month), 0);
                    break;
                case 'year':
                    start = new Date(Number(year), 0, 1)
                    end = new Date(Number(year), 12, 0)
                    break;
                case 'any':
                    const startDate = moment.tz(to, 'Asia/Ho_Chi_Minh');
                    const endDate = moment.tz(from, 'Asia/Ho_Chi_Minh').endOf('day');
                    start = new Date(startDate.clone().utc().format())
                    end = new Date(endDate.clone().utc().format())
                    break;
            }
            const countType = await this.prismaService.post.groupBy({
                by: ['type'],
                _count: true,
                where: {
                    updatedAt: {
                        gte: start,
                        lte: end
                    },
                    verify: 1
                }
            })
            const countItem = await this.prismaService.post.groupBy({
                by: ['itemId'],
                _count: true,
                orderBy: {
                    itemId: 'asc'
                },
                where: {
                    updatedAt: {
                        gte: start,
                        lte: end
                    },
                    verify: 1
                }
            })
            const location = await this.prismaService.location.findMany({
                include: {
                    Post: true
                },
                where: {
                    Post: {
                        some: {
                            updatedAt: {
                                gte: start,
                                lte: end
                            }
                        }
                    }
                }
            })
            const countLocation = location.map(elment => ({ id: elment.id, _count: elment.Post.length }))
            return new ResponseData<any>({ countType, countItem, countLocation }, 200, 'Thống kê')
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async getListStudentRetureItemSuccessful(option: { type: string, month: string, year: string, to: string, from: string }) {
        let start: any
        let end: any
        try {
            const { type, month, year, to, from } = option
            switch (type) {
                case 'month':
                    start = new Date(Number(year), Number(month) - 1, 1)
                    end = new Date(Number(year), Number(month), 0);
                    break;
                case 'year':
                    start = new Date(Number(year), 0, 1)
                    end = new Date(Number(year), 12, 0)
                    break;
                case 'any':
                    const startDate = moment.tz(to, 'Asia/Ho_Chi_Minh');
                    const endDate = moment.tz(from, 'Asia/Ho_Chi_Minh').endOf('day');
                    start = new Date(startDate.clone().utc().format())
                    end = new Date(endDate.clone().utc().format())
                    break;
            }
            let list: { lost: string, found: string, item: string, major: string, day: Date, school: string }[] = []
            const lostandfond = await this.prismaService.request.findMany({
                where: {
                    status: 1,
                    createdAt: {
                        gte: start,
                        lte: end
                    }
                },
                include: {
                    User: {
                        select: {
                            id: true,
                            studentId: true,
                            Major: {
                                include: {
                                    School: true
                                }
                            }
                        },
                    },
                    Post: {
                        include: {
                            User: {
                                select: {
                                    id: true,
                                    studentId: true,
                                    Major: {
                                        include: {
                                            School: true
                                        }
                                    }
                                }
                            },
                            Item: true
                        }
                    }
                }
            })
            const sendProtection = await this.prismaService.post.findMany({
                where: {
                    done: {
                        in: [-1, -2]
                    },
                    updatedAt: {
                        gte: start,
                        lte: end
                    },
                    verify: 1
                },
                include: {
                    User: {
                        select: {
                            id: true,
                            studentId: true,
                            Major: {
                                include: {
                                    School: true
                                }
                            }
                        }
                    },
                    Item: true
                }
            })
            lostandfond.forEach(e => {
                if (e.Post.type == true) {
                    list.push({ found: e.Post.User.studentId, school: e.Post.User.Major.School.name, major: e.Post.User.Major.name, lost: e.User.studentId, item: e.Post.Item.name, day: e.updatedAt })
                } else {
                    list.push({ found: e.User.studentId, school: e.User.Major.School.name, major: e.User.Major.name, lost: e.Post.User.studentId, item: e.Post.Item.name, day: e.updatedAt })
                }
            })
            sendProtection.forEach(e => {
                list.push({ found: e.User.studentId, school: e.User.Major.School.name, major: e.User.Major.name, lost: '', item: e.Item.name, day: e.updatedAt })
            })
            return new ResponseData<any>(list, 200, 'Thống kê')
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async downloadExcel(option: { type: string, month: string, year: string, to: string, from: string }) {
        let start: any
        let end: any
        try {
            let list: { stt: number, lost: string, found: string, item: string, major: string, day: string, school: string }[] = []
            let rows: any[] = []
            const { type, month, year, to, from } = option
            switch (type) {
                case 'month':
                    start = new Date(Number(year), Number(month) - 1, 1)
                    end = new Date(Number(year), Number(month), 0);
                    break;
                case 'year':
                    start = new Date(Number(year), 0, 1)
                    end = new Date(Number(year), 12, 0)
                    break;
                case 'any':
                    const startDate = moment.tz(to, 'Asia/Ho_Chi_Minh');
                    const endDate = moment.tz(from, 'Asia/Ho_Chi_Minh').endOf('day');
                    start = new Date(startDate.clone().utc().format())
                    end = new Date(endDate.clone().utc().format())
                    break;
            }
            const lostandfond = await this.prismaService.request.findMany({
                where: {
                    status: 1,
                    createdAt: {
                        gte: start,
                        lte: end
                    }
                },
                include: {
                    User: {
                        select: {
                            id: true,
                            studentId: true,
                            Major: {
                                include: {
                                    School: true
                                }
                            }
                        },
                    },
                    Post: {
                        include: {
                            User: {
                                select: {
                                    id: true,
                                    studentId: true,
                                    Major: {
                                        include: {
                                            School: true
                                        }
                                    }
                                }
                            },
                            Item: true
                        }
                    }
                }
            })
            const sendProtection = await this.prismaService.post.findMany({
                where: {
                    done: {
                        in: [-1, -2]
                    },
                    updatedAt: {
                        gte: start,
                        lte: end
                    },
                    verify: 1
                },
                include: {
                    User: {
                        select: {
                            id: true,
                            studentId: true,
                            Major: {
                                include: {
                                    School: true
                                }
                            }
                        }
                    },
                    Item: true
                }
            })
            let count = 1
            lostandfond.forEach(e => {
                if (e.Post.type == true) {
                    list.push({ stt: count, found: e.Post.User.studentId, school: e.Post.User.Major.School.name, major: e.Post.User.Major.name, lost: e.User.studentId, item: e.Post.Item.name, day: moment(e.updatedAt).format('DD-MM-YYYY') })
                } else {
                    list.push({ stt: count, found: e.User.studentId, school: e.User.Major.School.name, major: e.User.Major.name, lost: e.Post.User.studentId, item: e.Post.Item.name, day: moment(e.updatedAt).format('DD-MM-YYYY') })
                }
                count++
            })
            sendProtection.forEach(e => {
                list.push({ stt: count, found: e.User.studentId, school: e.User.Major.School.name, major: e.User.Major.name, lost: '', item: e.Item.name, day: moment(e.updatedAt).format('DD-MM-YYYY') })
                count++
            })
            list.forEach(doc => {
                rows.push(Object.values(doc))
            })
            let book = new Workbook()
            let name = this.setDate(option)
            let sheet = book.addWorksheet(`DanhSach-${name}`)
            const imageId = book.addImage({
                filename: join(__dirname, 'logo/logo.png'),
                extension: 'png'
            });
            sheet.addImage(imageId, { tl: { col: 1, row: 1 }, ext: { width: 70, height: 70 } });
            sheet.getCell('B3').value = 'TRƯỜNG ĐẠI HỌC CẦN THƠ'
            sheet.getCell('B3').font = { size: 12 };
            sheet.getCell('B3').alignment = { vertical: 'middle', horizontal: 'center' }
            sheet.mergeCells('B3:C3')
            sheet.getCell('B4').value = 'ĐOÀN THANH NIÊN'
            sheet.getCell('B4').font = { size: 12, bold: true };
            sheet.getCell('B4').alignment = { vertical: 'middle', horizontal: 'center' }
            sheet.mergeCells('B4:C4')
            sheet.getCell('E3').value = 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM'
            sheet.getCell('E3').font = { size: 12, bold: true };
            sheet.getCell('E3').alignment = { vertical: 'middle', horizontal: 'center' }
            sheet.mergeCells('E3:G3')
            sheet.getCell('E4').value = 'Độc Lập - Tự Do - Hạnh Phúc'
            sheet.getCell('E4').font = { size: 12, bold: true };
            sheet.getCell('E4').alignment = { vertical: 'middle', horizontal: 'center' }
            sheet.mergeCells('E4:G4')
            sheet.getCell('A6').value = 'DANH SÁCH CÁC SINH VIÊN NHẶT VÀ TRẢ LẠI ĐỒ VẬT THÀNH CÔNG'
            sheet.getCell('A6').font = { size: 16, bold: true };
            sheet.getCell('A6').alignment = { vertical: 'middle', horizontal: 'center' }
            sheet.mergeCells('A6:G6')
            sheet.getCell('A7').value = `Thời gian: ${name}`
            sheet.getCell('A7').font = { size: 12 };
            sheet.getCell('A7').alignment = { vertical: 'middle', horizontal: 'center' }
            sheet.mergeCells('A7:G7')
            rows.unshift(['STT', 'Người tìm thấy', 'Trường / khoa', 'Chuyên ngành', 'Người thất lạc', 'Loại đồ', 'Ngày'])
            rows.unshift('')
            sheet.addRows(rows)
            sheet.getColumn(1).width = 5
            sheet.getColumn(2).width = 20.5
            sheet.getColumn(3).width = 40
            sheet.getColumn(4).width = 40
            sheet.getColumn(5).width = 20.5
            sheet.getColumn(6).width = 20.5
            sheet.getColumn(7).width = 20.5
            for (let i = 0; i < 7; i++) {
                sheet.getCell(9, i + 1).font = { size: 12, bold: true }
                sheet.getCell(9, i + 1).alignment = { vertical: 'middle', horizontal: 'center' }
                sheet.getCell(9, i + 1).border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            }
            for (let j = 0; j < rows.length - 2; j++) {
                for (let i = 0; i < 7; i++) {
                    sheet.getCell(j + 10, i + 1).font = { size: 12 }
                    sheet.getCell(`A${j + 10}`).alignment = { vertical: 'middle', horizontal: 'center' }
                    sheet.getCell(j + 10, i + 1).border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                }
            }
            return { data: book, name: name }
        } catch (error) {
            this.logger.error(error.message)
        }
    }

    setDate(option) {
        let result = ''
        switch (option.type) {
            case 'month':
                result = `Tháng ${option.month}-${option.year}`
                break;
            case 'year':
                result = `Năm ${option.year}`
                break;
            case 'any':
                result = `Từ ngày ${moment(option.to).format('DD-MM-YYYY')} đến ${moment(option.from).format('DD-MM-YYYY')}`
                break;
        }
        return result
    }
}
