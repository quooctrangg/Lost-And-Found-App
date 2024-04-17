import { Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { SuggestService } from './suggest.service';
import { MyJWTGuard, RolesGuard } from '../auth/guard';
import { GetUser, Roles } from '../auth/decorator';
import { USER_TYPES } from '../global';
import { User } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('suggest')
@UseGuards(MyJWTGuard, RolesGuard)
export class SuggestController {
    constructor(private readonly suggestService: SuggestService) { }

    @Get()
    @Roles(USER_TYPES.USER, USER_TYPES.POST_MANAGE, USER_TYPES.ADMIN)
    suggestItemsBasedOnDescription(@GetUser() user: User) {
        return this.suggestService.suggestItemsBasedOnDescription(user.id)
    }

    @Post('near-image')
    @UseInterceptors(FileInterceptor('image'))
    getNearImage(@UploadedFile() image: Express.Multer.File) {
        return this.suggestService.getNearImage(image.buffer.toString('base64'))
    }
}
