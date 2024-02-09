import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PAGE_SIZE, ResponseData } from '../global';
import { CreateLocationDto, UpdateLocationDto } from './dto';

@Injectable()
export class LocationService {
    constructor(private readonly prismaService: PrismaService) { }

    async get(option: { page: number, key: string }) {
        try {
            let { page, key } = option
            let totalPages = 1
            let pageSize = undefined
            let next = undefined
            let where: any = {}
            if (key) {
                where.OR = [
                    {
                        name: {
                            contains: key,
                            mode: 'insensitive'
                        }
                    },
                    {
                        symbol: {
                            contains: key,
                            mode: 'insensitive'
                        }
                    }
                ]
            }
            if (page) {
                pageSize = PAGE_SIZE.PAGE_LOCATION
                const totalCount = await this.prismaService.location.count({
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
            const data = await this.prismaService.location.findMany({
                orderBy: {
                    id: 'asc'
                },
                skip: next,
                take: pageSize,
                where: where
            })
            return new ResponseData<any>({ data, totalPages }, 200, 'Tìm thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async create(createLocationDto: CreateLocationDto) {
        try {
            await this.prismaService.location.create({
                data: { ...createLocationDto }
            })
            return new ResponseData<any>(null, 200, 'Tạo thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async update(id: number, updateLocationDto: UpdateLocationDto) {
        try {
            const data = await this.prismaService.location.findUnique({
                where: {
                    id: id
                }
            })
            if (!data) return new ResponseData<any>(null, 400, 'Không tìm thấy')
            await this.prismaService.location.update({
                where: {
                    id: id
                },
                data: { ...updateLocationDto }
            })
            return new ResponseData<any>(null, 200, 'Cập nhật thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async delete(id: number) {
        try {
            const data = await this.prismaService.location.findUnique({
                where: {
                    id: id
                }
            })
            if (!data) return new ResponseData<any>(null, 400, 'Không tìm thấy')
            await this.prismaService.location.delete({
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
