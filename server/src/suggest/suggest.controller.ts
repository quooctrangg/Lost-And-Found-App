import { Controller, Get, UseGuards } from '@nestjs/common';
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
  getSuggest(@GetUser() user: User) {
    return this.suggestService.getSuggest(user.id)
  }
}
