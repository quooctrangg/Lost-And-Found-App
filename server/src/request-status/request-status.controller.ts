import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { RequestStatusService } from './request-status.service';
import { CreateRequestStatusDto, UpdateRequestStatusDto } from './dto';

@Controller('request-status')
export class RequestStatusController {
    constructor(private readonly requestStatusService: RequestStatusService) { }

    @Get()
    get() {
        return this.requestStatusService.get()
    }

    @Post()
    create(@Body() createRequestStatusDto: CreateRequestStatusDto) {
        return this.requestStatusService.create(createRequestStatusDto)
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateRequestStatusDto: UpdateRequestStatusDto) {
        return this.requestStatusService.update(id, updateRequestStatusDto)
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.requestStatusService.delete(id)
    }
}
