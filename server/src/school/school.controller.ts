import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateSchoolDto, UpdateSchoolDto } from './dto';
import { SchoolService } from './school.service';
import { MyJWTGuard, RolesGuard } from '../auth/guard';
import { Role } from '../auth/decorator';
import { USER_TYPES } from '../global';

@Controller('school')
export class SchoolController {
    constructor(private readonly schoolService: SchoolService) { }

    @Get()
    get(@Query() option: { page: number, key: string }) {
        return this.schoolService.get(option)
    }

    @Post()
    @UseGuards(MyJWTGuard, RolesGuard)
    @Role(USER_TYPES.ADMIN)
    create(@Body() createschoolDto: CreateSchoolDto) {
        return this.schoolService.create(createschoolDto)
    }

    @Patch(':id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Role(USER_TYPES.ADMIN)
    update(@Param('id', ParseIntPipe) id: number, @Body() updateschoolDto: UpdateSchoolDto) {
        return this.schoolService.update(id, updateschoolDto)
    }

    @Delete(':id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Role(USER_TYPES.ADMIN)
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.schoolService.delete(id)
    }
}
