import { Controller, Post, Body, Res } from '@nestjs/common';
import { LoginUserDto } from './dto/user.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './auth.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    return this.authService.login(loginUserDto, res);
  }
}
