import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateTypeDto, UpdateTypeDto } from './dto';
import { TypeService } from './type.service';

@Controller('type')
export class TypeController {
    constructor(private readonly typeService: TypeService) { }

    @Get()
    get() {
        return this.typeService.get()
    }

    @Post()
    create(@Body() createTypeDto: CreateTypeDto) {
        return this.typeService.create(createTypeDto)
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateTypeDto: UpdateTypeDto) {
        return this.typeService.update(id, updateTypeDto)
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.typeService.delete(id)
    }
}
