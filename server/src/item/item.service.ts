import { Injectable } from '@nestjs/common';
import { PAGE_SIZE, ResponseData } from '../global';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto, UpdateItemDto } from './dto';

@Injectable()
export class ItemService {
    constructor(private readonly prismaService: PrismaService) { }

    async get(option: { page: number, key: string }) {
        const pageSize = PAGE_SIZE.PAGE_SCHOOL
        try {
            let { page, key } = option
            const totalCount = await this.prismaService.item.count({
                where: {
                    name: {
                        contains: key
                    }
                },
                orderBy: {
                    id: 'asc'
                }
            })
            let totalPages = Math.ceil(totalCount / pageSize)
            if (!totalPages) totalPages = 1
            if (!page || page < 1) page = 1
            let next = (page - 1) * pageSize
            const data = await this.prismaService.item.findMany({
                orderBy: {
                    id: 'asc'
                },
                skip: next,
                take: pageSize,
                where: {
                    name: {
                        contains: key,
                        mode: 'insensitive'
                    }
                }
            })
            return new ResponseData<any>({ totalPages, data }, 200, 'Tìm thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async create(createItemDto: CreateItemDto) {
        try {
            await this.prismaService.item.create({
                data: {
                    name: createItemDto.name
                }
            })
            return new ResponseData<any>(null, 200, 'Tạo thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async update(id: number, updateItemDto: UpdateItemDto) {
        try {
            const data = await this.prismaService.item.findUnique({
                where: {
                    id: id
                }
            })
            if (!data) return new ResponseData<any>(null, 400, 'Không tìm thấy')
            await this.prismaService.item.update({
                where: {
                    id: id
                },
                data: {
                    name: updateItemDto.name
                }
            })
            return new ResponseData<any>(null, 200, 'Cập nhật thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async delete(id: number) {
        try {
            const data = await this.prismaService.item.findUnique({
                where: {
                    id: id
                }
            })
            if (!data) return new ResponseData<any>(null, 400, 'Không tìm thấy')
            await this.prismaService.item.delete({
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
