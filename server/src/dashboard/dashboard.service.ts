import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseData } from '../global';

@Injectable()
export class DashboardService {
  constructor(private readonly prismaService: PrismaService) { }

  async getStatistical() {
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
}
