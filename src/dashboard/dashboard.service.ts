import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import { CustomError } from 'src/common/expections';
import { School, SchoolDocument } from 'src/school/schema/school.schema';
import { Student, StudentDocument } from 'src/student/schema/student.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(School.name) private schoolModel: Model<SchoolDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  //---------Get count of student and school--------------
  async getSchoolStudentCount(res: Response) {
    try {
      const [countSchool, countStudent] = await Promise.all([
        this.schoolModel.countDocuments().exec(),
        this.studentModel.countDocuments().exec(),
      ]);
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: 'Count get successfully',
        data: { schoolCount: countSchool, studentCount: countStudent },
      });
    } catch (error) {
      throw CustomError.customException(
        error.response.message ? error.response.message : error.response,
        error.response.statusCode ? error.response.statusCode : error.status,
      );
    }
  }

  //---------Get count of students school wise--------------
  async getStudentCountsBySchool(res: Response) {
    try {
      const countData = await this.schoolModel.aggregate([
        {
          $lookup: {
            from: 'student',
            localField: '_id',
            foreignField: 'schoolId',
            as: 'students',
          },
        },
        {
          $addFields: {
            studentsCount: { $size: '$students' },
          },
        },
        {
          $project: {
            _id: 0,
            name: 1,
            studentsCount: 1,
          },
        },
      ]);
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: 'Student count school wise get successfully',
        data: countData,
      });
    } catch (error) {
      throw CustomError.customException(
        error.response.message ? error.response.message : error.response,
        error.response.statusCode ? error.response.statusCode : error.status,
      );
    }
  }
}
