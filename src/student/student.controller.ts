import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { StudentService } from './student.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ListStudentsDto, StudentDto } from './dto/student.dto';
import { Response } from 'express';
import {
  imageFileFilter,
  storageConfig,
} from 'src/common/UploadFile/file-upload';

@ApiBearerAuth()
@ApiTags('Student')
@Controller('student-management')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('/create')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: storageConfig('./uploads/student'),
      fileFilter: imageFileFilter,
      limits: { fileSize: 1024 * 1024 * 2 }, // 2MB limit
    }),
  )
  create(
    @Body() body: StudentDto,
    @UploadedFile() photo: any,
    @Res() res: Response,
  ) {
    if (!photo) {
      throw new HttpException('Photo is required', HttpStatus.BAD_REQUEST);
    }
    body.photo = photo.filename;
    return this.studentService.createStudent(body, res);
  }

  @Get('/studentList')
  listStudents(@Query() query: ListStudentsDto, @Res() res: Response) {
    return this.studentService.listStudents(
      query.page,
      query.limit,
      query.search,
      query.sortBy,
      query.sortOrder,
      query.std,
      res,
    );
  }

  @Get('viewStudent/:id')
  viewStudent(@Param('id') id: string, @Res() res: Response) {
    return this.studentService.findStudentDetails(id, res);
  }

  @Patch('updateStudent/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: storageConfig('./uploads/student'),
      fileFilter: imageFileFilter,
      limits: { fileSize: 1024 * 1024 * 2 }, // 2MB limit
    }),
  )
  update(
    @Param('id') id: string,
    @UploadedFile() photo: any,
    @Body() body: StudentDto,
    @Res() res: Response,
  ) {
    if (!photo) {
      throw new HttpException('Photo is required', HttpStatus.BAD_REQUEST);
    }
    body.photo = photo.filename;
    return this.studentService.updateStudent(id, body, res);
  }

  @Patch('activeInActiveStudent/:id')
  toggleActive(@Param('id') id: string, @Res() res: Response) {
    return this.studentService.toggleActive(id, res);
  }

  @Delete('deleteStudent/:id')
  remove(@Param('id') id: string, @Res() res: Response) {
    return this.studentService.deleteStudent(id, res);
  }
}
