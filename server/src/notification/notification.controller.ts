import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { MyJWTGuard } from 'src/auth/guard';


@Controller('notification')
@UseGuards(MyJWTGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @Get()
  getAllNotificationsByUserId(@GetUser() user: User) {
    return this.notificationService.getAllNotificationByUserId(user.id)
  }
}
