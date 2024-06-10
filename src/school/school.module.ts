import { Module } from '@nestjs/common';
import { School, SchoolSchema } from './schema/school.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: School.name, schema: SchoolSchema }]),
  ],
  providers: [SchoolService],
  controllers: [SchoolController],
})
export class SchoolModule {}
