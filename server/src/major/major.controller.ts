import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { MajorService } from './major.service';
import { CreateMajorDto, UpdateMajorDto } from './dto';
import { MyJWTGuard, RolesGuard } from '../auth/guard';
import { Role } from '../auth/decorator';
import { USER_TYPES } from '../global';

@Controller('major')
export class MajorController {
  constructor(private readonly majorService: MajorService) { }

  @Get()
  @UseGuards(MyJWTGuard, RolesGuard)
  @Role(USER_TYPES.ADMIN)
  getAlls(@Query() option: { page: number, key: string, schoolId: number }) {
    return this.majorService.getAlls(option)
  }

  @Get(':schoolId')
  getAllsBySchoolId(@Param('schoolId', ParseIntPipe) schoolId: number) {
    return this.majorService.getAllsBySchoolId(schoolId)
  }

  @Post()
  @UseGuards(MyJWTGuard, RolesGuard)
  @Role(USER_TYPES.ADMIN)
  create(@Body() createMajorDto: CreateMajorDto) {
    return this.majorService.create(createMajorDto)
  }

  @Patch(':id')
  @UseGuards(MyJWTGuard, RolesGuard)
  @Role(USER_TYPES.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMajorDto: UpdateMajorDto) {
    return this.majorService.update(id, updateMajorDto)
  }

  @Delete(':id')
  @UseGuards(MyJWTGuard, RolesGuard)
  @Role(USER_TYPES.ADMIN)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.majorService.delete(id)
  }
}
