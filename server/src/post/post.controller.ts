import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { CreatPostDto } from './dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Post()
    @UseInterceptors(FilesInterceptor('images', 5))
    createPost(@GetUser() user: User, createPostDto: CreatPostDto, @UploadedFiles() images: Express.Multer.File[]) {
        return this.postService.createPost(user.id, createPostDto, images)
    }
}
