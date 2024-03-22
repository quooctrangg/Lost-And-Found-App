import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser, Role } from '../auth/decorator';
import { User } from '@prisma/client';
import { ForgotPasswordDto, VerifyCodeDto, CreateUserDto, BanUserDto, UpdatePasswordDto, UpdateProfileDto, UpdateUserDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MyJWTGuard, RolesGuard } from '../auth/guard';
import { USER_TYPES } from '../global';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('me')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Role(USER_TYPES.USER)
    getUser(@GetUser() user: User) {
        return this.userService.getUser(user)
    }

    @Get()
    @UseGuards(MyJWTGuard, RolesGuard)
    @Role(USER_TYPES.ADMIN)
    getAllUser(@Query() option: { page: number, key: string, isBan: string, schoolId: number, majorId: number }) {
        return this.userService.getAllUser(option)
    }

    @Get('profile/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Role(USER_TYPES.USER)
    getProfileUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.getProfileUser(id)
    }

    @Post()
    @UseGuards(MyJWTGuard, RolesGuard)
    @Role(USER_TYPES.ADMIN)
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto)
    }

    @Patch('ban/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Role(USER_TYPES.ADMIN)
    banUser(@Param('id', ParseIntPipe) id: number, @Body() banUserDto: BanUserDto) {
        return this.userService.banUser(id, banUserDto)
    }

    @Patch('un-ban/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Role(USER_TYPES.ADMIN)
    unBanUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.unBanUser(id)
    }

    // @Patch('update-profile')
    // @UseGuards(MyJWTGuard, RolesGuard)
    // @Role(USER_TYPES.USER)
    // updateProfile(@GetUser() user: User, @Body() updateProfileDto: UpdateProfileDto) {
    //     return this.userService.updateProfile(user.id, updateProfileDto)
    // }

    @Patch('update-avatar')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Role(USER_TYPES.USER)
    @UseInterceptors(FileInterceptor('image'))
    updateAvatar(@GetUser() user: User, @UploadedFile() image: Express.Multer.File) {
        return this.userService.updateAvatar(user.id, image)
    }

    @Patch('update-user/:id')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Role(USER_TYPES.ADMIN)
    @UseInterceptors(FileInterceptor('image'))
    updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto, @UploadedFile() image: Express.Multer.File) {
        return this.userService.updateUser(id, updateUserDto, image)
    }

    @Patch('update-password')
    @UseGuards(MyJWTGuard, RolesGuard)
    @Role(USER_TYPES.USER)
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
