import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { School, SchoolSchema } from 'src/school/schema/school.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from 'src/student/schema/student.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: School.name, schema: SchoolSchema },
      { name: Student.name, schema: StudentSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
