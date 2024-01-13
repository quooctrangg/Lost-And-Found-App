import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { SearchHistoryService } from './search-history.service';
import { SearchHistoryDto } from './dto';
import { GetUser } from '../auth/decorator';

@Controller('search-history')
export class SearchHistoryController {
    constructor(private readonly searchHistoryService: SearchHistoryService) { }

    @Get()
    get(@GetUser() user: User) {
        return this.searchHistoryService.get(user.id)
    }

    @Post()
    create(@GetUser() user: User, @Body() searchHistoryDto: SearchHistoryDto) {
        return this.searchHistoryService.create(user.id, searchHistoryDto)
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.searchHistoryService.delete(id)
    }
}
