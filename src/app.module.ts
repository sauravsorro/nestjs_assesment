import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './auth/schemas/user.schema';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { SchoolModule } from './school/school.module';
import { SchoolSchema } from './school/schema/school.schema';
import { MailerModule } from '@nestjs-modules/mailer';
import { DashboardModule } from './dashboard/dashboard.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: 'agileinfoways02@gmail.com',
          pass: 'vlhqwglsdeksidey',
        },
      },
    }),
    MongooseModule.forRoot('mongodb://localhost/school-management'),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'School', schema: SchoolSchema },
    ]),
    AuthModule,
    SchoolModule,
    DashboardModule,
    StudentModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtService,
  ],
})
export class AppModule {}
