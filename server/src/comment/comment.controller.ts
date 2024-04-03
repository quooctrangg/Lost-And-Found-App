import { Controller, Get, Post, Body, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto';
import { GetUser, Role } from '../auth/decorator';
import { User } from '@prisma/client';
import { MyJWTGuard, RolesGuard } from '../auth/guard';
import { USER_TYPES } from '../global';


@Controller('comment')
@UseGuards(MyJWTGuard, RolesGuard)
export class CommentController {
    constructor(private readonly commentService: CommentService) { }

    @Post()
    @Role(USER_TYPES.USER)
    createComment(@GetUser() user: User, @Body() createCommentDto: CreateCommentDto) {
        return this.commentService.createComment(user.id, createCommentDto);
    }

    @Get(':postId')
    @Role(USER_TYPES.USER)
    getAllCommentsByPostId(@Param('postId', ParseIntPipe) postId: number) {
        return this.commentService.getAllsCommetByPostId(postId)
    }
}
