import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { ImageService } from '../image/image.service';

@Module({
  controllers: [PostController],
  providers: [PostService, ImageService]
})
export class PostModule { }
