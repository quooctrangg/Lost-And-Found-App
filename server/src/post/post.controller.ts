import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service';
import { GetUser, Roles } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { CreatPostDto, VerifyPostDto } from './dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MyJWTGuard, RolesGuard } from '../auth/guard';
import { USER_TYPES } from '../global';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Post()
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.USER, USER_TYPES.POST_MANAGE, USER_TYPES.ADMIN)
    @UseInterceptors(FilesInterceptor('images', 5))
    createPost(@GetUser() user: User, @Body() createPostDto: CreatPostDto, @UploadedFiles() images: Express.Multer.File[]) {
        return this.postService.createPost(user.id, createPostDto, images)
    }

    @Get('post-for-admin')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.ADMIN, USER_TYPES.POST_MANAGE)
    getAllPostsForAdmin(@Query() option: { page: number, key: string, itemId: number, type: boolean, verify: number, to: string, from: string }) {
        return this.postService.getAllPostsForAdmin(option)
    }

    @Get('post-for-user')
    getAllPostsForUser(@Query() option: { key: string, page: number, type: boolean, itemId: number, locations: number[] }) {
        return this.postService.getAllPostsForUser(option)
    }

    @Patch('verify/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.ADMIN, USER_TYPES.POST_MANAGE)
    verifyPost(@Param('id', ParseIntPipe) id: number, @Body() verifyPostDto: VerifyPostDto, @GetUser() user: User) {
        return this.postService.verifyPost(id, verifyPostDto, user.id)
    }

    @Delete(':id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.USER, USER_TYPES.POST_MANAGE, USER_TYPES.ADMIN)
    deletePost(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
        return this.postService.deletePost(user, id)
    }

    @Get('details/:id')
    getPostById(@Param('id', ParseIntPipe) id: number) {
        return this.postService.getPostById(id)
    }

    @Get('post-by-user/:userId')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.USER, USER_TYPES.POST_MANAGE, USER_TYPES.ADMIN)
    getAllPostsByUserId(@GetUser() user: User, @Param('userId', ParseIntPipe) userId: number) {
        return this.postService.getAllPostsByUserId(user.id, userId)
    }

    @Post('search-post-by-image')
    @UseInterceptors(FileInterceptor('image'))
    searchPostByImage(@UploadedFile() image: Express.Multer.File) {
        return this.postService.searchPostByImage(image.buffer.toString('base64'))
    }

    @Get('get-posts-for-approved-by-admin')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.POST_MANAGE, USER_TYPES.ADMIN)
    getAllPostForApprovedByAdminId(@GetUser() user: User, @Query() option: { page: number }) {
        return this.postService.getAllPostForApprovedByAdminId(user.id, option)
    }
}
