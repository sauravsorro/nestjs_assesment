import { Controller, Get, Res } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  @Get('/schoolCount')
  schoolCount(@Res() res: Response) {
    return this.dashboardService.getSchoolCount(res);
  }

  @Get('/studentCount')
  studentCount(@Res() res: Response) {
    return this.dashboardService.getStudentCount(res);
  }

  @Get('/studentCount/schoolWise')
  studentCountSchoolWise(@Res() res: Response) {
    return this.dashboardService.getStudentCountsBySchool(res);
  }
}
