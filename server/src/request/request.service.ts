import { Injectable } from '@nestjs/common';
import { AcceptRequestDto, RejectRequestDto, CreateRequestDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseData } from '../global';
import { Request, User } from '@prisma/client';

@Injectable()
export class RequestService {
  constructor(private readonly prismaService: PrismaService) { }

  async createRequest(userId: number, createRequestDto: CreateRequestDto) {
    try {
      const isPost = await this.prismaService.post.findUnique({
        where: {
          id: createRequestDto.postId
        }
      })
      if (!isPost) {
        return new ResponseData<string>(null, 400, 'Bài viết không tồn tại')
      }
      if (userId === isPost.userId) {
        return new ResponseData<string>(null, 400, 'Bạn không thể yêu cầu bài viết của bạn')
      }
      if (isPost.type == true && isPost.done == -1) {
        return new ResponseData<string>(null, 400, 'Đồ vật đang ở ban quản lý tòa nhà')
      }
      const isRequest = await this.prismaService.request.findFirst({
        where: {
          userId: userId,
          postId: createRequestDto.postId
        }
      })
      if (isRequest) {
        return new ResponseData<string>(null, 400, 'Đã có yêu cầu trước đó')
      }
      await this.prismaService.request.create({
        data: {
          description: createRequestDto.description,
          userId: userId,
          postId: createRequestDto.postId
        }
      })
      return new ResponseData<string>(null, 200, 'Gửi yêu cầu thành công')
    } catch (error) {
      return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
    }
  }

  async acceptRequest(user: User, acceptRequestDto: AcceptRequestDto) {
    try {
      const isRequest = await this.prismaService.request.findUnique({
        where: {
          id: acceptRequestDto.idRequest
        },
        include: {
          Post: true
        }
      })
      if (!isRequest) {
        return new ResponseData<string>(null, 400, 'Yêu cầu không tồn tại')
      }
      if (isRequest.status !== 0) {
        return new ResponseData<string>(null, 400, 'Yêu cầu đã được trả lời')
      }
      if (user.id !== isRequest.Post.userId) {
        return new ResponseData<string>(null, 400, 'Bạn không có quyền truy cập')
      }
      await this.prismaService.request.update({
        where: {
          id: acceptRequestDto.idRequest
        },
        data: {
          status: 1
        }
      })
      await this.prismaService.request.updateMany({
        where: {
          postId: isRequest.postId,
          id: {
            not: acceptRequestDto.idRequest
          }
        },
        data: {
          status: -1
        }
      })
      await this.prismaService.post.update({
        where: {
          id: isRequest.postId
        },
        data: {
          done: 1
        }
      })
      return new ResponseData<string>(null, 200, 'Yêu cầu đã được chấp nhận')
    } catch (error) {
      return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
    }
  }

  async rejectRequest(user: User, rejectRequestDto: RejectRequestDto) {
    try {
      const isRequest = await this.prismaService.request.findUnique({
        where: {
          id: rejectRequestDto.idRequest
        },
        include: {
          Post: true
        }
      })
      if (!isRequest) {
        return new ResponseData<string>(null, 400, 'Yêu cầu không tồn tại')
      }
      if (isRequest.status !== 0) {
        return new ResponseData<string>(null, 400, 'Yêu cầu đã được trả lời')
      }
      if (user.id !== isRequest.Post.userId) {
        return new ResponseData<string>(null, 400, 'Bạn không có quyền truy cập')
      }
      await this.prismaService.request.update({
        where: {
          id: rejectRequestDto.idRequest
        },
        data: {
          status: -1
        }
      })
      return new ResponseData<string>(null, 200, 'Yêu cầu đã được từ chối')
    } catch (error) {
      return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
    }
  }

  async getAllRequestByUserId(userId: number) {
    try {
      const data = await this.prismaService.request.findMany({
        where: {
          Post: {
            userId: userId
          },
          status: 0
        },
        include: {
          Post: true,
          User: {
            select: {
              id: true,
              image: true,
              name: true
            }
          }
        },
        orderBy: {
          postId: 'desc'
        }
      })
      return new ResponseData<Request[]>(data, 200, 'Tìm thấy thành công')
    } catch (error) {
      return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
    }
  }

  async getRequestsSuccessByUserId(userId: number) {
    try {
      const data = await this.prismaService.request.findMany({
        where: {
          OR: [
            {
              userId: userId
            },
            {
              Post: {
                userId: userId
              }
            }
          ],
          status: 1
        },
        select: {
          User: {
            select: {
              id: true,
              name: true
            }
          },
          Post: {
            select: {
              Item: true,
              User: {
                select: {
                  id: true,
                  name: true
                }
              },
              type: true
            }
          },
          updatedAt: true,
          description: true
        },
        orderBy: {
          updatedAt: 'desc'
        }
      })
      return new ResponseData<any>(data, 200, 'Tìm thành công')
    } catch (error) {
      return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
    }
  }
}
