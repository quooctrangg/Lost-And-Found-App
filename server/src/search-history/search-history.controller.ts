import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { SearchHistoryService } from './search-history.service';
import { GetUser, Role } from '../auth/decorator';
import { User } from '@prisma/client';
import { CreateSearchHistoryDto } from './dto';
import { MyJWTGuard, RolesGuard } from '../auth/guard';
import { USER_TYPES } from '../global';

@Controller('search-history')
@UseGuards(MyJWTGuard, RolesGuard)
export class SearchHistoryController {
  constructor(private readonly searchHistoryService: SearchHistoryService) { }

  @Post()
  @Role(USER_TYPES.USER)
  create(@GetUser() user: User, @Body() createSearchHistoryDto: CreateSearchHistoryDto) {
    return this.searchHistoryService.create(user.id, createSearchHistoryDto)
  }

  @Get()
  @Role(USER_TYPES.USER)
  getAllsByUser(@GetUser() user: User) {
    return this.searchHistoryService.getAllsByUserId(user.id)
  }

  @Delete(':id')
  @Role(USER_TYPES.USER)
  delete(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.searchHistoryService.delete(user.id, id)
  }
}
