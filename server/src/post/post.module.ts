import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { SuggestService } from '../suggest/suggest.service';

@Module({
	controllers: [PostController],
	providers: [PostService, SuggestService]
})
export class PostModule { }
