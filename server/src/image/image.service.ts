import { Injectable } from '@nestjs/common';
import { Image } from '@prisma/client';
import { ResponseData } from '../global';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ImageService {
    constructor(private readonly prismaService: PrismaService) { }

    async get() {
        try {
            return new ResponseData<Image>(await this.prismaService.image.findMany({}), 200, 'Tìm thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async create(url: string) {
        try {
            await this.prismaService.image.create({
                data: {
                    url: url
                }
            })
            return new ResponseData<any>(null, 200, 'Tạo thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async update(id: number, url: string) {
        try {
            const data = await this.prismaService.image.findUnique({
                where: {
                    id: id
                }
            })
            if (!data) return new ResponseData<any>(null, 400, 'Không tìm thấy')
            await this.prismaService.image.update({
                where: {
                    id: id
                },
                data: {
                    url: url
                }
            })
            return new ResponseData<any>(null, 200, 'Cập nhật thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async delete(id: number) {
        try {
            const data = await this.prismaService.image.findUnique({
                where: {
                    id: id
                }
            })
            if (!data) return new ResponseData<any>(null, 400, 'Không tìm thấy')
            await this.prismaService.image.delete({
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
