import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { MessageService } from './message.service';
import { MyJWTGuard, RolesGuard } from '../auth/guard';
import { GetUser, Role } from '../auth/decorator';
import { USER_TYPES } from '../global';
import { User } from '@prisma/client';
import { SendImageDto, SendMessageDto } from './dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('message')
@UseGuards(MyJWTGuard, RolesGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) { }

  @Get(':conversationId')
  @Role(USER_TYPES.USER)
  getAllMessages(@GetUser() user: User, @Param('conversationId', ParseIntPipe) conversationId: number) {
    return this.messageService.getAllMessages(user.id, conversationId)
  }

  @Post('send-message')
  @Role(USER_TYPES.USER)
  sendMessage(@GetUser() user: User, @Body() sendMessageDto: SendMessageDto) {
    return this.messageService.sendMessage(user.id, sendMessageDto)
  }

  @Post('send-image')
  @Role(USER_TYPES.USER)
  @UseInterceptors(FilesInterceptor('images'))
  sendImage(@GetUser() user: User, @Body() sendImageDto: SendImageDto, @UploadedFiles() images: Express.Multer.File[]) {
    return this.messageService.sendImage(user.id, sendImageDto, images)
  }

  @Patch(':conversationId')
  @Role(USER_TYPES.USER)
  readMessages(@GetUser() user: User, @Param('conversationId', ParseIntPipe) conversationId: number) {
    return this.messageService.readMessages(user.id, conversationId)
  }
}
