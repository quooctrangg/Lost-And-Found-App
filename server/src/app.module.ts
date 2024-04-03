import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailingModule } from './mailing/mailing.module';
import { UserModule } from './user/user.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ItemModule } from './item/item.module';
import { LocationModule } from './location/location.module';
import { PostModule } from './post/post.module';
import { SchoolModule } from './school/school.module';
import { SocketModule } from './socket/socket.module';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { RequestModule } from './request/request.module';
import { CommentModule } from './comment/comment.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { NotificationModule } from './notification/notification.module';
import { SearchHistoryModule } from './search-history/search-history.module';
import { SuggestModule } from './suggest/suggest.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MajorModule } from './major/major.module';
import * as Joi from 'joi';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                PORT: Joi.number().required(),
            }),
        }),
        ScheduleModule.forRoot(),
        PrismaModule, AuthModule, MailingModule, UserModule,
        CloudinaryModule, ItemModule, LocationModule, PostModule,
        SchoolModule, SocketModule, ConversationModule, MessageModule,
        RequestModule, CommentModule, DashboardModule, NotificationModule,
        SearchHistoryModule, SuggestModule, MajorModule
    ]
})
export class AppModule { }
