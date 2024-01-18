import { Injectable } from '@nestjs/common';
import { Type } from '@prisma/client';
import { ResponseData } from '../global';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTypeDto, UpdateTypeDto } from './dto';

@Injectable()
export class TypeService {
    constructor(private readonly prismaService: PrismaService) { }

    async get() {
        try {
            return new ResponseData<Type[]>(await this.prismaService.type.findMany({}), 200, 'Tìm thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async create(createTypeDto: CreateTypeDto) {
        try {
            await this.prismaService.type.create({
                data: {
                    name: createTypeDto.name
                }
            })
            return new ResponseData<any>(null, 200, 'Tạo thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async update(id: number, updateTypeDto: UpdateTypeDto) {
        try {
            const data = await this.prismaService.type.findUnique({
                where: {
                    id: id
                }
            })
            if (!data) return new ResponseData<any>(null, 400, 'Không tìm thấy')
            await this.prismaService.type.update({
                where: {
                    id: id
                },
                data: {
                    name: updateTypeDto.name
                }
            })
            return new ResponseData<any>(null, 200, 'Cập nhật thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async delete(id: number) {
        try {
            const data = await this.prismaService.type.findUnique({
                where: {
                    id: id
                }
            })
            if (!data) return new ResponseData<any>(null, 400, 'Không tìm thấy')
            await this.prismaService.type.delete({
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
