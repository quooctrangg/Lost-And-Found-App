import { Controller, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
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

    @Patch(':id')
    readNotification(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
        return this.notificationService.readNotification(user.id, id)
    }
}
