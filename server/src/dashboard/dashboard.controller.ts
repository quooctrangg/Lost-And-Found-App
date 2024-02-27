import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { MyJWTGuard, RolesGuard } from '../auth/guard';
import { Role } from '../auth/decorator';
import { USER_TYPES } from '../global';

@Controller('dashboard')
@UseGuards(MyJWTGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('statistical')
  @Role(USER_TYPES.ADMIN)
  getStatistical(@Query() option: { type: string, month: string, year: string, to: string, from: string }) {
    return this.dashboardService.getStatistical(option)
  }

  @Get('chart')
  @Role(USER_TYPES.ADMIN)
  getChart(@Query() option: { type: string, month: string, year: string, to: string, from: string }) {
    return this.dashboardService.getChart(option)
  }

  @Get('list-student')
  @Role(USER_TYPES.ADMIN)
  getListStudentRetureItemSuccessful(@Query() option: { type: string, month: string, year: string, to: string, from: string }) {
    return this.dashboardService.getListStudentRetureItemSuccessful(option)
  }
}
