import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto, UpdateItemDto } from './dto';

@Controller('item')
export class ItemController {
    constructor(private readonly itemService: ItemService) { }

    @Get()
    get() {
        return this.itemService.get()
    }

    @Post()
    create(@Body() createItemDto: CreateItemDto) {
        return this.itemService.create(createItemDto)
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateItemDto: UpdateItemDto) {
        return this.itemService.update(id, updateItemDto)
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.itemService.delete(id)
    }
}
