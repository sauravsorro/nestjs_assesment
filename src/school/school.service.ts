// school.service.ts

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { School, SchoolDocument } from './schema/school.schema';
import { CreateSchoolDto, UpdateSchoolDto } from './dto/school.dto';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { generatePassword, idInvalid } from 'src/utils/constants';
import * as fs from 'fs';
import { CustomError } from 'src/common/expections';

@Injectable()
export class SchoolService {
  constructor(
    @InjectModel(School.name) private schoolModel: Model<SchoolDocument>,
    private readonly mailerService: MailerService,
  ) {}

  async sendPasswordEmail(email: string, password: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Your School Management System Password',
        text: `Your password is: ${password}`,
      });
    } catch (error) {
      throw error;
    }
  }

  async create(body: CreateSchoolDto, res: Response) {
    try {
      const emailExist = await this.schoolModel.findOne({
        email: body.email.toLowerCase(),
      });
      if (emailExist) {
        throw new HttpException(
          'School Email already exist',
          HttpStatus.BAD_REQUEST,
        );
      }
      const password = await generatePassword();
      const hashedPassword = await bcrypt.hash(password, 10);
      const createdSchool = await this.schoolModel.create({
        ...body,
        email: body.email.toLowerCase(),
        password: hashedPassword,
      });
      const responseSchool = createdSchool.toObject();
      delete responseSchool.password;

      //send password to email
      this.sendPasswordEmail(body.email, password);

      return res.status(HttpStatus.CREATED).send({
        statusCode: HttpStatus.CREATED,
        message: 'School Created Successfully and password sent to email',
        data: responseSchool,
      });
    } catch (error) {
      if (error) {
        fs.unlink(`./uploads/school/${body.photo}`, (err) => {
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

  async listSchools(
    page: number,
    limit: number,
    searchTerm: string,
    sortBy: string,
    sortOrder: string,
    city: string,
    res: Response,
  ) {
    try {
      const skip = (page - 1) * limit;
      // eslint-disable-next-line prefer-const
      let query: any = {};

      if (searchTerm) {
        const searchRegex = new RegExp(searchTerm, 'i');
        query.$or = [
          { name: { $regex: searchRegex } },
          { email: { $regex: searchRegex } },
        ];
      }

      if (city) {
        query.city = city;
      }

      const sortOptions = {};
      if (sortBy) {
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
      }

      const [schoolList, totalCount] = await Promise.all([
        this.schoolModel
          .find(query)
          .skip(skip)
          .limit(limit)
          .sort(sortOptions)
          .select('-password')
          .exec(),
        this.schoolModel.countDocuments(query).exec(),
      ]);

      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: 'School List Fetch Successfully',
        data: {
          list: schoolList,
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

  async findSchoolDetails(id: string, res: Response) {
    try {
      if (!idInvalid(id)) {
        throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
      }
      const school = await this.schoolModel
        .findById(id)
        .select('-password')
        .exec();
      if (!school) {
        throw new HttpException('School not found', HttpStatus.NOT_FOUND);
      }
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: 'School Details Get Successfully',
        data: school,
      });
    } catch (error) {
      throw CustomError.customException(
        error.response.message ? error.response.message : error.response,
        error.response.statusCode ? error.response.statusCode : error.status,
      );
    }
  }

  async updateSchool(id: string, body: UpdateSchoolDto, res: Response) {
    try {
      if (!idInvalid(id)) {
        throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
      }
      const school = await this.schoolModel.findById(id).exec();
      if (!school) {
        throw new HttpException('School not found', HttpStatus.NOT_FOUND);
      }
      const update = await this.schoolModel
        .findByIdAndUpdate(id, body, { new: true })
        .select('-password')
        .exec();
      return res.status(HttpStatus.CREATED).send({
        statusCode: HttpStatus.CREATED,
        message: 'School Update Successfully',
        data: update,
      });
    } catch (error) {
      if (error) {
        fs.unlink(`./uploads/school/${body.photo}`, (err) => {
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
}
