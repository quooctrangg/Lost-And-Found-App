import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto, UpdateItemDto } from './dto';
import { MyJWTGuard, RolesGuard } from '../auth/guard';
import { Roles } from '../auth/decorator';
import { USER_TYPES } from '../global';

@Controller('item')
export class ItemController {
    constructor(private readonly itemService: ItemService) { }

    @Get()
    get(@Query() option: { page: number, key: string }) {
        return this.itemService.get(option)
    }

    @Post()
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.ADMIN)
    create(@Body() createItemDto: CreateItemDto) {
        return this.itemService.create(createItemDto)
    }

    @Patch(':id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.ADMIN)
    update(@Param('id', ParseIntPipe) id: number, @Body() updateItemDto: UpdateItemDto) {
        return this.itemService.update(id, updateItemDto)
    }

    @Delete(':id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.ADMIN)
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.itemService.delete(id)
    }
}
