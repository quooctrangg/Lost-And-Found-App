import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { RequestService } from './request.service';
import { MyJWTGuard, RolesGuard } from '../auth/guard';
import { GetUser, Role } from '../auth/decorator';
import { USER_TYPES } from '../global';
import { User } from '@prisma/client';
import { AcceptRequestDto, CreateRequestDto, RejectRequestDto } from './dto';

@Controller('request')
@UseGuards(MyJWTGuard, RolesGuard)
export class RequestController {
  constructor(private readonly requestService: RequestService) { }

  @Post(':id')
  @Role(USER_TYPES.USER)
  createRequest(@GetUser() user: User, @Param('id', ParseIntPipe) id: number, @Body() createRequestDto: CreateRequestDto) {
    return this.requestService.createRequest(user.id, id, createRequestDto)
  }

  @Patch('accept')
  @Role(USER_TYPES.USER)
  acceptRequest(@GetUser() user: User, @Body() acceptRequestDto: AcceptRequestDto) {
    return this.requestService.acceptRequest(user, acceptRequestDto)
  }

  @Patch('reject')
  @Role(USER_TYPES.USER)
  rejectRequest(@GetUser() user: User, @Body() rejectRequestDto: RejectRequestDto) {
    return this.requestService.rejectRequest(user, rejectRequestDto)
  }

  @Get()
  @Role(USER_TYPES.USER)
  getAllRequestByUserId(@GetUser() user: User) {
    return this.requestService.getAllRequestByUserId(user.id)
  }
}
