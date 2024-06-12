import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { LoginUserDto } from './dto/user.dto';
import { Response } from 'express';
import 'dotenv/config';
import { CustomError } from 'src/common/expections';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    await this.seedAdminUser();
  }
  //------------Create a initial admin-----------
  private async seedAdminUser() {
    const adminUser = await this.userModel.findOne({
      email: 'admin@yopmail.com',
    });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const newAdmin = new this.userModel({
        email: 'admin@yopmail.com',
        password: hashedPassword,
      });
      await newAdmin.save();
    }
  }

  //---------admin login---------
  async login(loginUserDto: LoginUserDto, res: Response) {
    try {
      const findAdminEmailExit = await this.userModel.findOne({
        email: loginUserDto.email.toLowerCase(),
      });
      if (!findAdminEmailExit) {
        throw new HttpException('Email does not exist', HttpStatus.NOT_FOUND);
      }
      if (
        !bcrypt.compareSync(loginUserDto.password, findAdminEmailExit.password)
      ) {
        throw new HttpException('InValid Password', HttpStatus.BAD_REQUEST);
      }

      //Generate authToken
      const tokenPayload = {
        _id: findAdminEmailExit._id,
        email: findAdminEmailExit.email,
      };

      const authToken = await this.jwtService.sign(tokenPayload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '10d',
      });
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        message: 'Login successfully',
        data: {
          authToken: authToken,
        },
      });
    } catch (error) {
      throw CustomError.customException(
        error.response.message ? error.response.message : error.response,
        error.response.statusCode ? error.response.statusCode : error.status,
      );
    }
  }
}
