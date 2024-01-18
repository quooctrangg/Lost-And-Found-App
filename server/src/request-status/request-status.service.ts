import { Injectable } from '@nestjs/common';
import { ResponseData } from '../global';
import { PrismaService } from '../prisma/prisma.service';
import { RequestStatus } from '@prisma/client';
import { CreateRequestStatusDto, UpdateRequestStatusDto } from './dto';

@Injectable()
export class RequestStatusService {
    constructor(private readonly prismaService: PrismaService) { }

    async get() {
        try {
            return new ResponseData<RequestStatus[]>(await this.prismaService.requestStatus.findMany({}), 200, 'Tìm thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async create(createRequestStatusDto: CreateRequestStatusDto) {
        try {
            await this.prismaService.requestStatus.create({
                data: {
                    name: createRequestStatusDto.name
                }
            })
            return new ResponseData<any>(null, 200, 'Tạo thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async update(id: number, updateRequestStatusDto: UpdateRequestStatusDto) {
        try {
            const data = await this.prismaService.requestStatus.findUnique({
                where: {
                    id: id
                }
            })
            if (!data) return new ResponseData<any>(null, 400, 'Không tìm thấy')
            await this.prismaService.requestStatus.update({
                where: {
                    id: id
                },
                data: {
                    name: updateRequestStatusDto.name
                }
            })
            return new ResponseData<any>(null, 200, 'Cập nhật thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async delete(id: number) {
        try {
            const data = await this.prismaService.requestStatus.findUnique({
                where: {
                    id: id
                }
            })
            if (!data) return new ResponseData<any>(null, 400, 'Không tìm thấy')
            await this.prismaService.requestStatus.delete({
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
