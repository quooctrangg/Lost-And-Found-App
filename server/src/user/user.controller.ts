import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser, Roles } from '../auth/decorator';
import { User } from '@prisma/client';
import { ForgotPasswordDto, VerifyCodeDto, CreateUserDto, BanUserDto, UpdatePasswordDto, UpdateUserDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MyJWTGuard, RolesGuard } from '../auth/guard';
import { USER_TYPES } from '../global';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('me')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.USER, USER_TYPES.POST_MANAGE, USER_TYPES.ADMIN)
    getUser(@GetUser() user: User) {
        return this.userService.getUser(user)
    }

    @Get()
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.ADMIN)
    getAllUser(@Query() option: { page: number, key: string, isBan: string, schoolId: number, majorId: number, type: number }) {
        return this.userService.getAllUser(option)
    }

    @Get('profile/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.USER, USER_TYPES.POST_MANAGE, USER_TYPES.ADMIN)
    getProfileUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.getProfileUser(id)
    }

    @Post()
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.ADMIN)
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto)
    }

    @Post('users')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.ADMIN)
    @UseInterceptors(FileInterceptor('file'))
    createUsers(@UploadedFile() file: Express.Multer.File) {
        return this.userService.createUsers(file)
    }

    @Patch('ban/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.ADMIN)
    banUser(@Param('id', ParseIntPipe) id: number, @Body() banUserDto: BanUserDto) {
        return this.userService.banUser(id, banUserDto)
    }

    @Patch('un-ban/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.ADMIN)
    unBanUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.unBanUser(id)
    }

    @Patch('update-avatar')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.USER, USER_TYPES.POST_MANAGE, USER_TYPES.ADMIN)
    @UseInterceptors(FileInterceptor('image'))
    updateAvatar(@GetUser() user: User, @UploadedFile() image: Express.Multer.File) {
        return this.userService.updateAvatar(user.id, image)
    }

    @Patch('update-user/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.ADMIN)
    @UseInterceptors(FileInterceptor('image'))
    updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto, @UploadedFile() image: Express.Multer.File) {
        return this.userService.updateUser(id, updateUserDto, image)
    }

    @Patch('update-password')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Roles(USER_TYPES.USER, USER_TYPES.POST_MANAGE, USER_TYPES.ADMIN)
    updatePassword(@GetUser() user: User, @Body() updatePasswordDto: UpdatePasswordDto) {
        return this.userService.updatePassword(user.id, updatePasswordDto)
    }

    @Patch('forgot-password')
    forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.userService.forgotPassword(forgotPasswordDto)
    }

    @Post('send-verify-code')
    sendVerifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
        return this.userService.sendVerifyCode(verifyCodeDto)
    }
}
