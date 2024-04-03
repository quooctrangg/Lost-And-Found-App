import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSearchHistoryDto } from './dto';
import { ResponseData } from '../global';
import { SearchHistory } from '@prisma/client';

@Injectable()
export class SearchHistoryService {
    constructor(private readonly prismaService: PrismaService) { }

    private readonly logger = new Logger(SearchHistoryService.name);

    async getAllsByUserId(userId: number) {
        try {
            const data = await this.prismaService.searchHistory.findMany({
                where: {
                    userId: userId
                },
                take: 5,
                orderBy: {
                    id: 'desc'
                }
            })
            return new ResponseData<SearchHistory[]>(data, 200, 'Tìm thành công')
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async create(userId: number, createSearchHistoryDto: CreateSearchHistoryDto) {
        try {
            const data = await this.prismaService.searchHistory.findFirst({
                where: {
                    content: createSearchHistoryDto.content,
                    userId: userId
                }
            })
            if (data) {
                return new ResponseData<string>(null, 400, 'Đã tồn tại')
            }
            await this.prismaService.searchHistory.create({
                data: {
                    content: createSearchHistoryDto.content,
                    userId: userId
                }
            })
            return new ResponseData<SearchHistory>(null, 200, 'Tạo thành công')
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }

    async delete(userId: number, id: number) {
        try {
            const data = await this.prismaService.searchHistory.findUnique({
                where: {
                    id: id,
                    userId: userId
                }
            })
            if (!data) {
                return new ResponseData<string>(null, 400, 'Không tồn tại')
            }
            await this.prismaService.searchHistory.delete({
                where: {
                    id: id,
                    userId: userId
                }
            })
            return new ResponseData<string>(null, 200, 'Xóa thành công')
        } catch (error) {
            this.logger.error(error.message)
            return new ResponseData<string>(null, 500, 'Lỗi dịch vụ, thử lại sau')
        }
    }
}
