import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto, UpdateImageDto } from './dto';

@Controller('image')
export class ImageController {
    constructor(private readonly imageService: ImageService) { }

    @Get()
    get() {
        return this.imageService.get()
    }

    @Post()
    create(@Body() createImageDto: CreateImageDto) {
        return this.imageService.create(createImageDto)
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateImageDto: UpdateImageDto) {
        return this.imageService.update(id, updateImageDto)
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.imageService.delete(id)
    }
}
