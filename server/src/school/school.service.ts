import { Injectable } from '@nestjs/common';
import { PAGE_SIZE, ResponseData } from '../global';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSchoolDto, UpdateSchoolDto } from './dto';

@Injectable()
export class SchoolService {
    constructor(private readonly prismaService: PrismaService) { }

    async get(option: { page: number, key: string }) {
        const pageSize = PAGE_SIZE.PAGE_SCHOOL
        try {
            let { page, key } = option
            const totalCount = await this.prismaService.school.count({
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
            const data = await this.prismaService.school.findMany({
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
            return new ResponseData<any>({ data, totalPages }, 200, 'Tìm thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async create(createSchoolDto: CreateSchoolDto) {
        try {
            await this.prismaService.school.create({
                data: {
                    name: createSchoolDto.name
                }
            })
            return new ResponseData<any>(null, 200, 'Tạo thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async update(id: number, updateSchoolDto: UpdateSchoolDto) {
        try {
            const data = await this.prismaService.school.findUnique({
                where: {
                    id: id
                }
            })
            if (!data) return new ResponseData<any>(null, 400, 'Không tìm thấy')
            await this.prismaService.school.update({
                where: {
                    id: id
                },
                data: {
                    name: updateSchoolDto.name
                }
            })
            return new ResponseData<any>(null, 200, 'Cập nhật thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async delete(id: number) {
        try {
            const data = await this.prismaService.school.findUnique({
                where: {
                    id: id
                }
            })
            if (!data) return new ResponseData<any>(null, 400, 'Không tìm thấy')
            await this.prismaService.school.delete({
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
