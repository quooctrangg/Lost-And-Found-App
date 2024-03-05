import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SuggestService } from './suggest.service';
import { MyJWTGuard, RolesGuard } from '../auth/guard';
import { GetUser, Role } from '../auth/decorator';
import { USER_TYPES } from '../global';
import { User } from '@prisma/client';

@Controller('suggest')
export class SuggestController {
  constructor(private readonly suggestService: SuggestService) { }

  @Get()
  getSuggest() {
    return this.suggestService.getSuggest(1)
  }
}
