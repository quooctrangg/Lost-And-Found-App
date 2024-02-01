import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailingModule } from './mailing/mailing.module';
import { SearchHistoryModule } from './search-history/search-history.module';
import { UserModule } from './user/user.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ItemModule } from './item/item.module';
import { LocationModule } from './location/location.module';
import { TypeModule } from './type/type.module';
import { RequestStatusModule } from './request-status/request-status.module';
import { ConversationModule } from './conversation/conversation.module';
import { ImageModule } from './image/image.module';
import { MessageModule } from './message/message.module';
import { RequestModule } from './request/request.module';
import { PostModule } from './post/post.module';
import { NotificationModule } from './notification/notification.module';
import { CommentModule } from './comment/comment.module';
import { FeedbackModule } from './feedback/feedback.module';
import { SchoolModule } from './school/school.module';
import { VerifyCodeModule } from './verify-code/verify-code.module';
import * as Joi from 'joi';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: Joi.object({
      PORT: Joi.number().required(),
    }),
  }), PrismaModule, AuthModule, MailingModule, SearchHistoryModule, UserModule, CloudinaryModule, ItemModule, LocationModule, TypeModule, RequestStatusModule, ConversationModule, ImageModule, MessageModule, RequestModule, PostModule, NotificationModule, CommentModule, FeedbackModule, SchoolModule, VerifyCodeModule]
})
export class AppModule { }
