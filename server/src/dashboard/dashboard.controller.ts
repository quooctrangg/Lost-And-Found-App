import { Controller, Get, Header, Query, Res, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { MyJWTGuard, RolesGuard } from '../auth/guard';
import { Role } from '../auth/decorator';
import { USER_TYPES } from '../global';
import type { Response } from 'express'
import * as moment from 'moment-timezone';

@Controller('dashboard')
// @UseGuards(MyJWTGuard, RolesGuard)
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

  @Get('download-excel')
  // @Role(USER_TYPES.ADMIN)
  async downloadExcel(@Res({ passthrough: true }) res: Response, @Query() option: { type: string, month: string, year: string, to: string, from: string }) {
    const { data, name } = await this.dashboardService.downloadExcel(option)
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    res.setHeader("Content-Disposition", "attachment; filename=" + `Danh sach ${name}.xlsx`)
    return data.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  }

}
