import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { RequestService } from './request.service';
import { MyJWTGuard, RolesGuard } from '../auth/guard';
import { GetUser, Roles } from '../auth/decorator';
import { USER_TYPES } from '../global';
import { User } from '@prisma/client';
import { AcceptRequestDto, CreateRequestDto, RejectRequestDto } from './dto';

@Controller('request')
@UseGuards(MyJWTGuard, RolesGuard)
export class RequestController {
    constructor(private readonly requestService: RequestService) { }

    @Post()
    @Roles(USER_TYPES.USER, USER_TYPES.POST_MANAGE, USER_TYPES.ADMIN)
    createRequest(@GetUser() user: User, @Body() createRequestDto: CreateRequestDto) {
        return this.requestService.createRequest(user.id, createRequestDto)
    }

    @Patch('accept')
    @Roles(USER_TYPES.USER, USER_TYPES.POST_MANAGE, USER_TYPES.ADMIN)
    acceptRequest(@GetUser() user: User, @Body() acceptRequestDto: AcceptRequestDto) {
        return this.requestService.acceptRequest(user, acceptRequestDto)
    }

    @Patch('reject')
    @Roles(USER_TYPES.USER, USER_TYPES.POST_MANAGE, USER_TYPES.ADMIN)
    rejectRequest(@GetUser() user: User, @Body() rejectRequestDto: RejectRequestDto) {
        return this.requestService.rejectRequest(user, rejectRequestDto)
    }

    @Get()
    @Roles(USER_TYPES.USER, USER_TYPES.POST_MANAGE, USER_TYPES.ADMIN)
    getAllRequestsByUserId(@GetUser() user: User) {
        return this.requestService.getAllRequestByUserId(user.id)
    }

    @Get('request-success')
    @Roles(USER_TYPES.USER, USER_TYPES.POST_MANAGE, USER_TYPES.ADMIN)
    getRequestsSuccessByUserId(@GetUser() user: User) {
        return this.requestService.getRequestsSuccessByUserId(user.id)
    }
}
