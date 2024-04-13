import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto, UpdateLocationDto } from './dto';
import { MyJWTGuard, RolesGuard } from '../auth/guard';
import { Roles } from '../auth/decorator';
import { USER_TYPES } from '../global';

@Controller('location')
export class LocationController {
    constructor(private readonly locationService: LocationService) { }

    @Get()
    get(@Query() option: { page: number, key: string }) {
        return this.locationService.get(option)
    }

    @Post()
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.ADMIN)
    create(@Body() createLocationDto: CreateLocationDto) {
        return this.locationService.create(createLocationDto)
    }

    @Patch(':id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.ADMIN)
    update(@Param('id', ParseIntPipe) id: number, @Body() updateLocationDto: UpdateLocationDto) {
        return this.locationService.update(id, updateLocationDto)
    }

    @Delete(':id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.ADMIN)
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.locationService.delete(id)
    }
}
