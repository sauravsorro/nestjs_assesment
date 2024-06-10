import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import { School, SchoolDocument } from 'src/school/schema/school.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(School.name) private schoolModel: Model<SchoolDocument>,
  ) {}

  async getSchoolCount(res: Response) {
    try {
      const count = await this.schoolModel.countDocuments().exec();
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: 'School Count get successfully',
        data: { schoolCount: count },
      });
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
