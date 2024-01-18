import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchHistoryDto } from './dto';
import { ResponseData } from '../global';
import { SearchHistory } from '@prisma/client';

@Injectable()
export class SearchHistoryService {
    constructor(private readonly prismaService: PrismaService) { }

    async get(userId: number) {
        try {
            return new ResponseData<SearchHistory[]>(await this.prismaService.searchHistory.findMany({
                where: {
                    userId: userId
                },
                take: 5
            }), 200, 'Tìm thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async create(userId: number, searchHistoryDto: SearchHistoryDto) {
        try {
            await this.prismaService.searchHistory.create({
                data: {
                    userId: userId,
                    content: searchHistoryDto.content
                }
            })
            return new ResponseData<string>(null, 200, 'Tạo thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async delete(id: number) {
        try {
            await this.prismaService.searchHistory.delete({
                where: {
                    id: id
                }
            })
            return new ResponseData<string>(null, 200, 'Xóa thành công')
        } catch (error) {
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
}
