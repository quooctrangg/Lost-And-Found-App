import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseData } from '../global';
import { Notification } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(private readonly prismaService: PrismaService) { }

  async getAllNotificationByUserId(userId: number) {
    try {
      const notifications = await this.prismaService.notification.findMany({
        where: {
          Comment: {
            OR: [
              {
                Post: {
                  userId: userId
                }
              },
              {
                parent: {
                  userId: userId
                }
              }
            ]
          }
        },
        include: {
          Comment: {
            include: {
              parent: {
                select: {
                  id: true,
                  content: true
                }
              },
              Post: {
                select: {
                  id: true,
                  title: true,
                  User: {
                    select: {
                      id: true,
                      name: true,
                      image: true
                    }
                  }
                }
              },
              User: {
                select: {
                  id: true,
                  name: true,
                  image: true
                }
              }
            }
          }
        }
      })
      let totalRead = 0
      notifications.forEach(e => {
        if (e.read == false) {
          totalRead = totalRead + 1
        }
      })
      return new ResponseData<any>({ notifications, totalRead }, 200, 'Tìm thành công')
    } catch (error) {
      return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
    }
  }
}
