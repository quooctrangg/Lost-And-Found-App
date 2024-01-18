import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { VerifyStatusService } from './verify-status.service';
import { CreateVerifyStatusDto, UpdateVerifyStatusDto } from './dto';

@Controller('verify-status')
export class VerifyStatusController {
    constructor(private readonly verifyStatusService: VerifyStatusService) { }

    @Get()
    get() {
        return this.verifyStatusService.get()
    }

    @Post()
    create(@Body() createVerifyStatusDto: CreateVerifyStatusDto) {
        return this.verifyStatusService.create(createVerifyStatusDto)
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateVerifyStatusDto: UpdateVerifyStatusDto) {
        return this.verifyStatusService.update(id, updateVerifyStatusDto)
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.verifyStatusService.delete(id)
    }
}
