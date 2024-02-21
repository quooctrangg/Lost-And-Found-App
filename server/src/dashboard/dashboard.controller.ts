import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';


@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('statistical')
  getStatistical(@Query() option: {}) {
    return this.dashboardService.getStatistical(option)
  }

  @Get('chart')
  getChart(@Query() option: {}) {
    return this.dashboardService.getChart(option)
  }

  @Get('list-student')
  getListStudentRetureItemSuccessful(@Query() option: {}) {
    return this.dashboardService.getListStudentRetureItemSuccessful(option)
  }
}
