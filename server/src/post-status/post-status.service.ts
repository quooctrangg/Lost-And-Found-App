import { Injectable } from '@nestjs/common';
import { ResponseData } from '../global';
import { PrismaService } from '../prisma/prisma.service';
import { PostStatus } from '@prisma/client';
import { CreatePostStatusDto, UpdatePostStatusDto } from './dto';

@Injectable()
export class PostStatusService {
    constructor(private readonly prismaService: PrismaService) { }

    async get() {
        try {
            return new ResponseData<PostStatus[]>(await this.prismaService.postStatus.findMany({}), 200, 'Tìm thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async create(createPostStatusDto: CreatePostStatusDto) {
        try {
            await this.prismaService.postStatus.create({
                data: {
                    name: createPostStatusDto.name
                }
            })
            return new ResponseData<any>(null, 200, 'Tạo thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async update(id: number, updatePostStatusDto: UpdatePostStatusDto) {
        try {
            const data = await this.prismaService.postStatus.findUnique({
                where: {
                    id: id
                }
            })
            if (!data) return new ResponseData<any>(null, 400, 'Không tìm thấy')
            await this.prismaService.postStatus.update({
                where: {
                    id: id
                },
                data: {
                    name: updatePostStatusDto.name
                }
            })
            return new ResponseData<any>(null, 200, 'Cập nhật thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async delete(id: number) {
        try {
            const data = await this.prismaService.postStatus.findUnique({
                where: {
                    id: id
                }
            })
            if (!data) return new ResponseData<any>(null, 400, 'Không tìm thấy')
            await this.prismaService.postStatus.delete({
                where: {
                    id: id
                }
            })
            return new ResponseData<any>(null, 200, 'Xóa thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
}
