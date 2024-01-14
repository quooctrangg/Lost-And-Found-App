import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { ForgotPasswordDto, VerifyCodeDto, toggleBanUserDto, updatePasswordDto, updateProfileDto, updateUserDto } from './dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('me')
    getUser(@GetUser() user: User) {
        return this.userService.getUser(user.id)
    }

    @Get()
    getAllUser() {
        return this.userService.getAllUser()
    }

    @Patch('toggle-ban/:id')
    toggleBanUser(@Param('id', ParseIntPipe) id: number, @Body() toggleBanUserDto: toggleBanUserDto) {
        return this.userService.toggleBanUser(id, toggleBanUserDto)
    }

    @Patch('update-profile')
    updateProfile(@GetUser() user: User, @Body() updateProfileDto: updateProfileDto, @UploadedFile() image: Express.Multer.File) {
        return this.userService.updateProfile(user.id, updateProfileDto, image)
    }

    @Patch('update-user/:id')
    updateUser(@Param('id', ParseIntPipe) id: number, updateUserDto: updateUserDto, @UploadedFile() image: Express.Multer.File) {
        return this.userService.updateUser(id, updateUserDto, image)
    }

    @Patch('update-password')
    updatePassword(@GetUser() user: User, @Body() updatePasswordDto: updatePasswordDto) {
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
