import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseData } from '../global';
import { Workbook } from 'exceljs'
import * as moment from 'moment-timezone';

@Injectable()
export class DashboardService {
  constructor(private readonly prismaService: PrismaService) { }

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
          const endDate = moment.tz(from, 'Asia/Ho_Chi_Minh');
          start = new Date(startDate.clone().utc().format())
          end = new Date(endDate.clone().utc().format())
          break;
      }
      const user = await this.prismaService.user.count({
        where: {
          type: 1,
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
          createdAt: {
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
          createdAt: {
            gte: start,
            lte: end
          }
        }
      })
      return new ResponseData<any>({ user, post, request, done }, 200, 'Thống kê thành công')
    } catch (error) {
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
          const endDate = moment.tz(from, 'Asia/Ho_Chi_Minh');
          start = new Date(startDate.clone().utc().format())
          end = new Date(endDate.clone().utc().format())
          break;
      }
      const countType = await this.prismaService.post.groupBy({
        by: ['type'],
        _count: true,
        where: {
          createdAt: {
            gte: start,
            lte: end
          }
        }
      })
      const countItem = await this.prismaService.post.groupBy({
        by: ['itemId'],
        _count: true,
        orderBy: {
          itemId: 'asc'
        },
        where: {
          createdAt: {
            gte: start,
            lte: end
          }
        }
      })
      const location = await this.prismaService.location.findMany({
        include: {
          Post: true
        },
        where: {
          Post: {
            some: {
              createdAt: {
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
          const endDate = moment.tz(from, 'Asia/Ho_Chi_Minh');
          start = new Date(startDate.clone().utc().format())
          end = new Date(endDate.clone().utc().format())
          break;
      }
      let list: { lost: string, found: string, item: string, major: string, marjoId?: number, day: Date, school: string, schoolId?: number }[] = []
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
          done: -1,
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
          list.push({ found: e.Post.User.studentId, school: e.Post.User.Major.School.name, major: e.Post.User.Major.name, lost: e.User.studentId, item: e.Post.Item.name, day: e.updatedAt, marjoId: e.Post.User.Major.id, schoolId: e.Post.User.Major.schoolId })
        } else {
          list.push({ found: e.User.studentId, school: e.User.Major.School.name, major: e.User.Major.name, lost: e.Post.User.studentId, item: e.Post.Item.name, day: e.updatedAt, marjoId: e.User.Major.id, schoolId: e.User.Major.schoolId })
        }
      })
      sendProtection.forEach(e => {
        list.push({ found: e.User.studentId, school: e.User.Major.School.name, major: e.User.Major.name, lost: '', item: e.Item.name, day: e.updatedAt, marjoId: e.User.Major.id, schoolId: e.User.Major.schoolId })
      })
      list = list.sort((a, b) => {
        if (a.schoolId < b.schoolId) return 1
        if (a.schoolId > b.schoolId) return -1
        return a.marjoId - b.marjoId
      })
      list = list.map(({ schoolId, marjoId, ...rest }) => rest)
      return new ResponseData<any>(list, 200, 'Thống kê')
    } catch (error) {
      return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
    }
  }

  async downloadExcel(option: { type: string, month: string, year: string, to: string, from: string }) {
    let start: any
    let end: any
    let list: { lost: string, found: string, item: string, major: string, marjoId?: number, day: string, school: string, schoolId?: number }[] = []
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
        const endDate = moment.tz(from, 'Asia/Ho_Chi_Minh');
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
        done: -1,
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
        list.push({ found: e.Post.User.studentId, school: e.Post.User.Major.School.name, major: e.Post.User.Major.name, lost: e.User.studentId, item: e.Post.Item.name, day: moment(e.updatedAt).format('DD-MM-YYYY'), marjoId: e.Post.User.Major.id, schoolId: e.Post.User.Major.schoolId })
      } else {
        list.push({ found: e.User.studentId, school: e.User.Major.School.name, major: e.User.Major.name, lost: e.Post.User.studentId, item: e.Post.Item.name, day: moment(e.updatedAt).format('DD-MM-YYYY'), marjoId: e.User.Major.id, schoolId: e.User.Major.schoolId })
      }
    })
    sendProtection.forEach(e => {
      list.push({ found: e.User.studentId, school: e.User.Major.School.name, major: e.User.Major.name, lost: '', item: e.Item.name, day: moment(e.updatedAt).format('DD-MM-YYYY'), marjoId: e.User.Major.id, schoolId: e.User.Major.schoolId })
    })
    list = list.sort((a, b) => {
      if (a.schoolId < b.schoolId) return 1
      if (a.schoolId > b.schoolId) return -1
      return a.marjoId - b.marjoId
    })
    list = list.map(({ schoolId, marjoId, ...rest }) => rest)
    list.forEach(doc => {
      rows.push(Object.values(doc))
    })
    let book = new Workbook()
    let sheet = book.addWorksheet('DanhSach')
    let name = this.setDate(option)
    rows.unshift(['Người tìm thấy', 'Trường / khoa', 'Chuyên ngành', 'Người thất lạc', 'Loại đồ', 'Ngày'])
    rows.unshift([name])
    rows.unshift(['Danh sách các sinh viên nhặt và trả lại thành công'])
    sheet.addRows(rows)
    sheet.getColumn(1).width = 20.5
    sheet.getColumn(2).width = 50
    sheet.getColumn(3).width = 40
    sheet.getColumn(4).width = 20.5
    sheet.getColumn(5).width = 20.5
    sheet.getColumn(6).width = 20.5
    sheet.mergeCells(1, 1, 1, 6)
    sheet.mergeCells(2, 1, 2, 6)
    sheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' }
    sheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' }
    sheet.getCell('A1').font = { size: 20, bold: true };
    for (let i = 0; i < 6; i++) {
      sheet.getCell(3, i + 1).font = { size: 13, bold: true }
      sheet.getCell(3, i + 1).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    }
    for (let j = 4; j <= rows.length; j++) {
      for (let i = 0; i < 6; i++) {
        sheet.getCell(j, i + 1).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      }
    }
    return { data: book, name: name }
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
