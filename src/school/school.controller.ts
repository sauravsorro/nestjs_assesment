// school.controller.ts

import {
  Body,
  Controller,
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
import { SchoolService } from './school.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CreateSchoolDto,
  ListSchoolsDto,
  UpdateSchoolDto,
} from './dto/school.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import {
  imageFileFilter,
  storageConfig,
} from 'src/common/UploadFile/file-upload';

@ApiBearerAuth()
@ApiTags('School')
@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post('/create')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: storageConfig('./uploads/school'),
      fileFilter: imageFileFilter,
      limits: { fileSize: 1024 * 1024 * 2 }, // 2MB limit
    }),
  )
  create(
    @Body() body: CreateSchoolDto,
    @UploadedFile() photo: any,
    @Res() res: Response,
  ) {
    if (!photo) {
      throw new HttpException('Photo is required', HttpStatus.BAD_REQUEST);
    }
    body.photo = photo.filename;
    return this.schoolService.create(body, res);
  }

  @Get('/list')
  listSchools(@Query() query: ListSchoolsDto, @Res() res: Response) {
    return this.schoolService.listSchools(
      query.page,
      query.limit,
      query.search,
      query.sortBy,
      query.sortOrder,
      query.city,
      res,
    );
  }

  @Get(':id')
  viewSchool(@Param('id') id: string, @Res() res: Response) {
    return this.schoolService.findSchoolDetails(id, res);
  }

  @Patch('update/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: storageConfig('./uploads/school'),
      fileFilter: imageFileFilter,
      limits: { fileSize: 1024 * 1024 * 2 }, // 2MB limit
    }),
  )
  update(
    @Param('id') id: string,
    @UploadedFile() photo: any,
    @Body() body: UpdateSchoolDto,
    @Res() res: Response,
  ) {
    if (!photo) {
      throw new HttpException('Photo is required', HttpStatus.BAD_REQUEST);
    }
    body.photo = photo.filename;
    return this.schoolService.updateSchool(id, body, res);
  }
}
