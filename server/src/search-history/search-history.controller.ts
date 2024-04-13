import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { SearchHistoryService } from './search-history.service';
import { GetUser, Roles } from '../auth/decorator';
import { User } from '@prisma/client';
import { CreateSearchHistoryDto } from './dto';
import { MyJWTGuard, RolesGuard } from '../auth/guard';
import { USER_TYPES } from '../global';

@Controller('search-history')
@UseGuards(MyJWTGuard, RolesGuard)
export class SearchHistoryController {
    constructor(private readonly searchHistoryService: SearchHistoryService) { }

    @Post()
    @Roles(USER_TYPES.USER, USER_TYPES.POST_MANAGE, USER_TYPES.ADMIN)
    create(@GetUser() user: User, @Body() createSearchHistoryDto: CreateSearchHistoryDto) {
        return this.searchHistoryService.create(user.id, createSearchHistoryDto)
    }

    @Get()
    @Roles(USER_TYPES.USER, USER_TYPES.POST_MANAGE, USER_TYPES.ADMIN)
    getAllsByUser(@GetUser() user: User) {
        return this.searchHistoryService.getAllsByUserId(user.id)
    }

    @Delete(':id')
    @Roles(USER_TYPES.USER, USER_TYPES.POST_MANAGE, USER_TYPES.ADMIN)
    delete(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
        return this.searchHistoryService.delete(user.id, id)
    }
}
