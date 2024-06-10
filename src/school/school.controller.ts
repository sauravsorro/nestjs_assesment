// school.controller.ts

import {
  Body,
  Controller,
  Get,
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
import { extname } from 'path';
import { CreateSchoolDto, UpdateSchoolDto } from './dto/school.dto';
import { ApiBearerAuth, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { Response } from 'express';

@Controller('school')
@ApiTags('School')
@ApiBearerAuth()
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post('/create')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/school',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  create(
    @Body() body: CreateSchoolDto,
    @UploadedFile() photo: any,
    @Res() res: Response,
  ) {
    body.photo = photo.filename;
    return this.schoolService.create(body, res);
  }

  @Get('/list')
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'city',
    required: false,
    type: String,
  })
  listSchools(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
    @Query('sortBy') sortBy: string = '',
    @Query('sortOrder') sortOrder: string = '',
    @Query('city') city: string = '',
    @Res() res: Response,
  ) {
    return this.schoolService.listSchools(
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      city,
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
      storage: diskStorage({
        destination: './uploads/school',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @UploadedFile() photo: any,
    @Body() body: UpdateSchoolDto,
    @Res() res: Response,
  ) {
    body.photo = photo.filename;
    return this.schoolService.updateSchool(id, body, res);
  }
}
