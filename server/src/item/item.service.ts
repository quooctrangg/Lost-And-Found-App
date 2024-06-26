import { Injectable, Logger } from '@nestjs/common';
import { PAGE_SIZE, ResponseData } from '../global';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto, UpdateItemDto } from './dto';

@Injectable()
export class ItemService {
    constructor(private readonly prismaService: PrismaService) { }

    private readonly logger = new Logger(ItemService.name);

    async get(option: { page: number, key: string }) {
        try {
            let { page, key } = option
            let totalPages = 1
            let pageSize = undefined
            let next = undefined
            let where: any = {}
            if (key) {
                where.name = {
                    contains: key
                }
            }
            let totalCount = 0
            if (page) {
                pageSize = PAGE_SIZE.PAGE_SCHOOL
                totalCount = await this.prismaService.item.count({
                    where: where,
                    orderBy: {
                        id: 'asc'
                    }
                })
                totalPages = Math.ceil(totalCount / pageSize)
                if (!totalPages) totalPages = 1
                if (!page || page < 1) page = 1
                next = (page - 1) * pageSize
            }
            const data = await this.prismaService.item.findMany({
                orderBy: {
                    id: 'asc'
                },
                skip: next,
                take: pageSize,
                where: where
            })
            return new ResponseData<any>({ totalPages, data, totalCount }, 200, 'Tìm thành công')
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async create(createItemDto: CreateItemDto) {
        try {
            const data = await this.prismaService.item.findFirst({
                where: {
                    name: createItemDto.name
                }
            })
            if (data) {
                return new ResponseData<any>(null, 400, 'Đã tồn tại')
            }
            await this.prismaService.item.create({
                data: {
                    name: createItemDto.name
                }
            })
            return new ResponseData<any>(null, 200, 'Tạo thành công')
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async update(id: number, updateItemDto: UpdateItemDto) {
        try {
            const item = await this.prismaService.item.findFirst({
                where: {
                    name: updateItemDto.name
                }
            })
            if (item) {
                return new ResponseData<any>(null, 400, 'Đã tồn tại')
            }
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
            this.logger.error(error.message)
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
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
}
