import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SuggestService } from './suggest.service';
import { MyJWTGuard, RolesGuard } from '../auth/guard';
import { GetUser, Role } from '../auth/decorator';
import { USER_TYPES } from '../global';
import { User } from '@prisma/client';

@Controller('suggest')
@UseGuards(MyJWTGuard, RolesGuard)
export class SuggestController {
  constructor(private readonly suggestService: SuggestService) { }

  @Get()
  @Role(USER_TYPES.USER)
  suggestItemsBasedOnDescription(@GetUser() user: User) {
    return this.suggestService.suggestItemsBasedOnDescription(user.id)
  }

  @Post()
  @Role(USER_TYPES.ADMIN)
  updateData() {
    return this.suggestService.writeData()
  }
}
