import { Controller, Get, Post, Body, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto';
import { GetUser, Roles } from '../auth/decorator';
import { User } from '@prisma/client';
import { MyJWTGuard, RolesGuard } from '../auth/guard';
import { USER_TYPES } from '../global';


@Controller('comment')
@UseGuards(MyJWTGuard, RolesGuard)
export class CommentController {
    constructor(private readonly commentService: CommentService) { }

    @Post()
    @Roles(USER_TYPES.USER, USER_TYPES.POST_MANAGE, USER_TYPES.ADMIN)
    createComment(@GetUser() user: User, @Body() createCommentDto: CreateCommentDto) {
        return this.commentService.createComment(user.id, createCommentDto);
    }

    @Get(':postId')
    @Roles(USER_TYPES.USER, USER_TYPES.POST_MANAGE, USER_TYPES.ADMIN)
    getAllCommentsByPostId(@Param('postId', ParseIntPipe) postId: number) {
        return this.commentService.getAllsCommetByPostId(postId)
    }
}
