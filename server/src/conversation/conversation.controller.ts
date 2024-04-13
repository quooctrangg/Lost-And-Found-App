import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { GetUser, Roles } from '../auth/decorator';
import { User } from '@prisma/client';
import { AccessConversationDto } from './dto';
import { MyJWTGuard, RolesGuard } from '../auth/guard';
import { USER_TYPES } from '../global';

@Controller('conversation')
@UseGuards(MyJWTGuard, RolesGuard)
export class ConversationController {
    constructor(private readonly conversationService: ConversationService) { }

    @Post()
    @Roles(USER_TYPES.USER, USER_TYPES.POST_MANAGE, USER_TYPES.ADMIN)
    accessConversation(@GetUser() user: User, @Body() accessConversationDto: AccessConversationDto) {
        return this.conversationService.accessConversation(user.id, accessConversationDto)
    }

    @Get()
    @Roles(USER_TYPES.USER, USER_TYPES.POST_MANAGE, USER_TYPES.ADMIN)
    fetchConversation(@GetUser() user: User) {
        return this.conversationService.fetchConversations(user.id)
    }
}
