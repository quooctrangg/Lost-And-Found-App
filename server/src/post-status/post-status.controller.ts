import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { PostStatusService } from './post-status.service';
import { CreatePostStatusDto, UpdatePostStatusDto } from './dto';

@Controller('post-status')
export class PostStatusController {
    constructor(private readonly postStatusService: PostStatusService) { }

    @Get()
    get() {
        return this.postStatusService.get()
    }

    @Post()
    create(@Body() createPostStatusDto: CreatePostStatusDto) {
        return this.postStatusService.create(createPostStatusDto)
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updatePostStatusDto: UpdatePostStatusDto) {
        return this.postStatusService.update(id, updatePostStatusDto)
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.postStatusService.delete(id)
    }
}
