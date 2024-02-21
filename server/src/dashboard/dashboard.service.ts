import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseData } from '../global';

@Injectable()
export class DashboardService {
  constructor(private readonly prismaService: PrismaService) { }

  async getStatistical(option: {}) {
    try {
      const user = await this.prismaService.user.count({
        where: {
          type: 1
        }
      })
      const post = await this.prismaService.post.count({
        where: {
          verify: 1,
          isDelete: false
        }
      })
      const request = await this.prismaService.request.count({
        where: {

        }
      })
      const done = await this.prismaService.post.count({
        where: {
          done: true,
          isDelete: false,
          verify: 1
        }
      })
      return new ResponseData<any>({ user, post, request, done }, 200, 'Thống kê')
    } catch (error) {
      return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
    }
  }

  async getChart(option: {}) {
    try {
      const countType = await this.prismaService.post.groupBy({
        by: ['type'],
        _count: true
      })
      const countItem = await this.prismaService.post.groupBy({
        by: ['itemId'],
        _count: true,
        orderBy: {
          itemId: 'asc'
        }
      })
      const location = await this.prismaService.location.findMany({
        include: {
          Post: true
        }
      })
      const countLocation = location.map(elment => ({ id: elment.id, _count: elment.Post.length }))
      return new ResponseData<any>({ countType, countItem, countLocation }, 200, 'Thống kê')
    } catch (error) {
      return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
    }
  }

  async getListStudentRetureItemSuccessful(option: {}) {
    try {
      const list: [] = []
      const data = await this.prismaService.request.findMany({
        where: {

        }
      })
      console.log(data)
      return new ResponseData<any>(list, 200, 'Thống kê')
    } catch (error) {
      return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
    }
  }
}
