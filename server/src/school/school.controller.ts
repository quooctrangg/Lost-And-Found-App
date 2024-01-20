import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateSchoolDto, UpdateSchoolDto } from './dto';
import { SchoolService } from './school.service';

@Controller('school')
export class SchoolController {
    constructor(private readonly schoolService: SchoolService) { }

    @Get()
    get() {
        return this.schoolService.get()
    }

    @Post()
    create(@Body() createschoolDto: CreateSchoolDto) {
        return this.schoolService.create(createschoolDto)
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateschoolDto: UpdateSchoolDto) {
        return this.schoolService.update(id, updateschoolDto)
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.schoolService.delete(id)
    }
}
