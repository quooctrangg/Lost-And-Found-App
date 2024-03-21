import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseData } from '../global';
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
      const list: { lost: string, found: string, item: string, school: string, sendProtection: boolean }[] = []
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
              email: true,
              Major: true
            },
          },
          Post: {
            include: {
              User: {
                select: {
                  id: true,
                  email: true,
                  Major: true
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
              email: true,
              Major: true
            }
          },
          Item: true
        }
      })
      lostandfond.forEach(e => {
        if (e.Post.type == true) {
          list.push({ found: e.Post.User.email, school: e.Post.User.Major.name, lost: e.User.email, item: e.Post.Item.name, sendProtection: false })
        } else {
          list.push({ found: e.User.email, school: e.User.Major.name, lost: e.Post.User.email, item: e.Post.Item.name, sendProtection: false })
        }
      })
      sendProtection.forEach(e => {
        list.push({ found: e.User.email, school: e.User.Major.name, lost: '', item: e.Item.name, sendProtection: true })
      })
      return new ResponseData<any>(list, 200, 'Thống kê')
    } catch (error) {
      return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
    }
  }
}
