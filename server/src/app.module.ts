import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailingModule } from './mailing/mailing.module';
import { SearchHistoryModule } from './search-history/search-history.module';
import { UserModule } from './user/user.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { VerifyStatusModule } from './verify-status/verify-status.module';
import { ItemModule } from './item/item.module';
import { ImageModule } from './image/image.module';
import * as Joi from 'joi';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: Joi.object({
      PORT: Joi.number().required(),
    }),
  }), PrismaModule, AuthModule, MailingModule, SearchHistoryModule, UserModule, CloudinaryModule, VerifyStatusModule, ItemModule, ImageModule]
})
export class AppModule { }
