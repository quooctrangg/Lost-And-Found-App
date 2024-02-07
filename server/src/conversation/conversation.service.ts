import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccessConversationDto } from './dto';
import { ResponseData } from '../global';
import { Conversation } from '@prisma/client';

@Injectable()
export class ConversationService {
  constructor(private readonly prismaService: PrismaService) { }

  async accessConversation(reqUserId: number, accessConversationDto: AccessConversationDto) {
    try {
      const isConversation = await this.prismaService.conversation.findFirst({
        where: {
          AND: [
            {
              User: {
                some: {
                  id: reqUserId
                }
              }
            },
            {
              User: {
                some: {
                  id: accessConversationDto.userId
                }
              }
            }
          ]
        },
        include: {
          User: {
            select: {
              id: true,
              image: true,
              name: true
            }
          }
        }
      })
      if (isConversation) {
        return new ResponseData<Conversation>(isConversation, 200, 'Tìm thấy cuộc trò chuyện')
      } else {
        const connect = [reqUserId, accessConversationDto.userId]
        const newConversation = await this.prismaService.conversation.create({
          data: {
            User: {
              connect: connect.map(id => ({ id }))
            }
          },
          include: {
            User: {
              select: {
                id: true,
                image: true,
                name: true
              }
            }
          }
        })
        return new ResponseData<Conversation>(newConversation, 200, 'Tạo thành công cuộc trò chuyện')
      }
    } catch (error) {
      return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
    }
  }

  async fetchConversations(userId: number) {
    try {
      const conversations = await this.prismaService.conversation.findMany({
        where: {
          User: {
            some: {
              id: userId
            }
          }
        },
        include: {
          User: {
            select: {
              id: true,
              name: true,
              image: true
            }
          },
          Message: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              userId: true,
              isImage: true
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 1
          }
        }
      })
      conversations.sort((a, b) => b.Message[0].id - a.Message[0].id)
      return new ResponseData<Conversation[]>(conversations, 200, 'Tất cả liên hệ')
    } catch (error) {
      return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
    }
  }
}
