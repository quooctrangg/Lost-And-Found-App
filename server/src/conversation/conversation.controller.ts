import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { GetUser, Role } from '../auth/decorator';
import { User } from '@prisma/client';
import { AccessConversationDto } from './dto';
import { MyJWTGuard, RolesGuard } from '../auth/guard';
import { USER_TYPES } from '../global';

@Controller('conversation')
@UseGuards(MyJWTGuard, RolesGuard)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) { }

  @Post()
  @Role(USER_TYPES.USER)
  accessConversation(@GetUser() user: User, @Body() accessConversationDto: AccessConversationDto) {
    return this.conversationService.accessConversation(user.id, accessConversationDto)
  }

  @Get()
  @Role(USER_TYPES.USER)
  fetchConversation(@GetUser() user: User) {
    return this.conversationService.fetchConversations(user.id)
  }
}
