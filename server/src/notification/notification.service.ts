import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseData } from '../global';

@Injectable()
export class NotificationService {
  constructor(private readonly prismaService: PrismaService) { }

  private readonly logger = new Logger(NotificationService.name);

  async getAllNotificationByUserId(userId: number) {
    const currentDate = new Date()
    const tenDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 10));
    try {
      const notifications = await this.prismaService.notification.findMany({
        where: {
          AND: [
            {
              createdAt: {
                gte: tenDaysAgo
              }
            },
            {
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
            }
          ]
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
                  description: true,
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
        },
        orderBy: {
          createdAt: 'desc'
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
      this.logger.error(error.message)
      return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
    }
  }

  async readNotification(userId: number, id: number) {
    try {
      const notification = await this.prismaService.notification.findUnique({
        where: {
          id: id
        },
        include: {
          Comment: {
            include: {
              parent: {
                select: {
                  userId: true
                }
              },
              Post: {
                select: {
                  userId: true
                }
              }
            }
          }
        }
      })
      if (!notification) {
        return new ResponseData<string>(null, 400, 'Thông báo không tồn tại')
      }
      if (notification.Comment?.parent?.userId !== userId && notification.Comment.Post.userId !== userId) {
        return new ResponseData<string>(null, 400, 'Bạn không có quyền đọc')
      }
      if (notification.read) {
        return new ResponseData<string>(null, 400, 'Thông báo đã được đọc')
      }
      await this.prismaService.notification.update({
        where: {
          id: id
        },
        data: {
          read: true
        }
      })
      return new ResponseData<string>(null, 200, 'Xem thông báo thành công')
    } catch (error) {
      this.logger.error(error.message)
      return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
    }
  }
}
