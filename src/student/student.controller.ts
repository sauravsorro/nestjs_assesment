import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('student')
@ApiTags('Student')
@ApiBearerAuth()
export class StudentController {}
