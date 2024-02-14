import { Injectable } from '@nestjs/common';
import { AcceptRequestDto, RejectRequestDto, CreateRequestDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseData } from '../global';
import { Request, User } from '@prisma/client';

@Injectable()
export class RequestService {
  constructor(private readonly prismaService: PrismaService) { }

  async createRequest(userId: number, id: number, createRequestDto: CreateRequestDto) {
    try {
      const isPost = await this.prismaService.post.findUnique({
        where: {
          id: id
        }
      })
      if (!isPost) {
        return new ResponseData<string>(null, 400, 'Bài viết không tồn tại')
      }
      await this.prismaService.request.create({
        data: {
          description: createRequestDto.description,
          userId: userId,
          postId: id
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
          postId: isRequest.postId
        },
        data: {
          status: -1
        }
      })
      return new ResponseData<string>(null, 200, 'Trả lời thành công')
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
      return new ResponseData<string>(null, 200, 'Trả lời thành công')
    } catch (error) {
      return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
    }
  }

  async getAllRequestByUserId(userId: number) {
    try {
      const data = await this.prismaService.request.findMany({
        where: {
          userId: userId
        }
      })
      return new ResponseData<Request[]>(data, 200, 'Tìm thấy thành công')
    } catch (error) {
      return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
    }
  }
}
