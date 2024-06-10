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

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    await this.seedAdminUser();
  }

  private async seedAdminUser() {
    const adminUser = await this.userModel.findOne({
      email: 'admin@yopmail.com',
    });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const newAdmin = new this.userModel({
        email: 'admin@yopmail.com',
        password: hashedPassword,
        role: 'admin',
      });
      await newAdmin.save();
    }
  }

  async login(loginUserDto: LoginUserDto, res: Response) {
    try {
      const findAdminEmailExit = await this.userModel.findOne({
        email: loginUserDto.email.toLowerCase(),
        role: loginUserDto.role,
      });
      if (!findAdminEmailExit) {
        throw new HttpException('Email does not exist', HttpStatus.NOT_FOUND);
      }
      if (
        !bcrypt.compareSync(loginUserDto.password, findAdminEmailExit.password)
      ) {
        throw new HttpException('InValid Password', HttpStatus.BAD_REQUEST);
      }

      const tokenPayload = {
        _id: findAdminEmailExit._id,
        email: findAdminEmailExit.email,
        role: findAdminEmailExit.role,
      };

      const authToken = await this.jwtService.sign(tokenPayload, {
        secret: 'secret_key',
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
      throw new HttpException(error.response, error.status);
    }
  }
}
