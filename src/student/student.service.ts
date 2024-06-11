import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Student, StudentDocument } from './schema/student.schema';
import { Model } from 'mongoose';
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto';
import { Response } from 'express';
import * as fs from 'fs';
import { School, SchoolDocument } from 'src/school/schema/school.schema';
import { idInvalid, isValidDateFormat } from 'src/utils/constants';
import { CustomError } from 'src/common/expections';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(School.name) private schoolModel: Model<SchoolDocument>,
  ) {}

  async create(body: CreateStudentDto, res: Response) {
    try {
      if (!idInvalid(body.schoolId)) {
        throw new HttpException('Invalid SchoolId', HttpStatus.BAD_REQUEST);
      }
      const schoolIdExist = await this.schoolModel.find({ _id: body.schoolId });
      if (!schoolIdExist) {
        throw new HttpException(
          'Please enter valid school Id',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check if date of birth is in 'yyyy-mm-dd' format
      if (!isValidDateFormat(body.dob)) {
        throw new HttpException(
          'Invalid Date of Birth or Invalid Format of Date of Birth, format should be yyyy-mm-dd',
          HttpStatus.BAD_REQUEST,
        );
      }

      const createStudent = await this.studentModel.create(body);
      return res.status(HttpStatus.CREATED).send({
        statusCode: HttpStatus.CREATED,
        message: 'Student Created Successfully',
        data: createStudent,
      });
    } catch (error) {
      if (error) {
        fs.unlink(`./uploads/student/${body.photo}`, (err) => {
          if (err) {
            throw new HttpException(
              'Something went wrong,please try again',
              HttpStatus.BAD_REQUEST,
            );
          }
        });
      }
      throw CustomError.customException(
        error.response.message ? error.response.message : error.response,
        error.response.statusCode ? error.response.statusCode : error.status,
      );
    }
  }

  async listStudents(
    page: number,
    limit: number,
    searchTerm: string,
    sortBy: string,
    sortOrder: string,
    std: string,
    res: Response,
  ) {
    try {
      const skip = (page - 1) * limit;
      // eslint-disable-next-line prefer-const
      let query: any = {};

      if (searchTerm) {
        const searchRegex = new RegExp(searchTerm, 'i');
        query.$or = [{ name: { $regex: searchRegex } }];
      }
      if (std) {
        const stdValid = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
        if (stdValid.includes(std)) {
          query.std = std;
        } else {
          throw new HttpException(
            'Std should be between 1 to 10',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const sortOptions = {};
      if (sortBy) {
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
      }

      const [studentList, totalCount] = await Promise.all([
        this.studentModel
          .find(query)
          .skip(skip)
          .limit(limit)
          .sort(sortOptions)
          .exec(),
        this.studentModel.countDocuments(query).exec(),
      ]);

      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: 'Student List Fetch Successfully',
        data: {
          list: studentList,
          totalCount: totalCount,
        },
      });
    } catch (error) {
      throw CustomError.customException(
        error.response.message ? error.response.message : error.response,
        error.response.statusCode ? error.response.statusCode : error.status,
      );
    }
  }

  async findStudentDetails(id: string, res: Response) {
    try {
      if (!idInvalid(id)) {
        throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
      }
      const student = await this.studentModel.findById(id).exec();
      if (!student) {
        throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: 'Student Details Get Successfully',
        data: student,
      });
    } catch (error) {
      throw CustomError.customException(
        error.response.message ? error.response.message : error.response,
        error.response.statusCode ? error.response.statusCode : error.status,
      );
    }
  }

  async updateStudent(id: string, body: UpdateStudentDto, res: Response) {
    try {
      if (!idInvalid(id)) {
        throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
      }
      const student = await this.studentModel.findById(id).exec();
      if (!student) {
        throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }
      const schoolIdExist = await this.schoolModel.find({ _id: body.schoolId });
      if (!schoolIdExist) {
        throw new HttpException(
          'Please enter valid school Id',
          HttpStatus.BAD_REQUEST,
        );
      }
      const update = await this.studentModel
        .findByIdAndUpdate(id, body, { new: true })
        .exec();
      return res.status(HttpStatus.CREATED).send({
        statusCode: HttpStatus.CREATED,
        message: 'Student Update Successfully',
        data: update,
      });
    } catch (error) {
      if (error) {
        fs.unlink(`./uploads/student/${body.photo}`, (err) => {
          if (err) {
            throw new HttpException(
              'Something went wrong,please try again',
              HttpStatus.BAD_REQUEST,
            );
          }
        });
      }
      throw CustomError.customException(
        error.response.message ? error.response.message : error.response,
        error.response.statusCode ? error.response.statusCode : error.status,
      );
    }
  }

  async toggleActive(id: string, res: Response) {
    try {
      if (!idInvalid(id)) {
        throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
      }
      const student = await this.studentModel.findById(id);
      if (!student) {
        throw new HttpException('Student not found', HttpStatus.BAD_REQUEST);
      }
      await this.studentModel.findOneAndUpdate(
        { _id: id },
        {
          isActive: !student.isActive,
        },
      );
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: 'Student Status change successfully',
        data: {},
      });
    } catch (error) {
      throw CustomError.customException(
        error.response.message ? error.response.message : error.response,
        error.response.statusCode ? error.response.statusCode : error.status,
      );
    }
  }

  async deleteStudent(id: string, res: Response) {
    try {
      if (!idInvalid(id)) {
        throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
      }
      const student = await this.studentModel.findById(id).exec();
      if (!student) {
        throw new HttpException('Student not found', HttpStatus.BAD_GATEWAY);
      }
      await this.studentModel.findByIdAndDelete(id).exec();
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: 'Student Delete Successfully',
        data: true,
      });
    } catch (error) {
      throw CustomError.customException(
        error.response.message ? error.response.message : error.response,
        error.response.statusCode ? error.response.statusCode : error.status,
      );
    }
  }
}
