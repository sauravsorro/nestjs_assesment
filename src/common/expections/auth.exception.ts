import { HttpException, HttpStatus } from '@nestjs/common';

export const AuthExceptions = {
  TokenExpired(): any {
    return new HttpException(
      {
        message: 'Token Expired use RefreshToken',
        error: 'TokenExpiredError',
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  },

  UserNotExist(): any {
    return new HttpException(
      {
        message: 'Email does not exist',
        error: 'NotFound',
        statusCode: HttpStatus.NOT_FOUND,
      },
      HttpStatus.NOT_FOUND,
    );
  },

  InvalidToken(): any {
    return new HttpException(
      {
        message: 'Invalid Token',
        error: 'InvalidToken',
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  },

  ForbiddenException(): any {
    return new HttpException(
      {
        message: 'This resource is forbidden from this user',
        error: 'UnAuthorizedResourceError',
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  },

  ExistUser(): any {
    return new HttpException(
      {
        message: 'Aleardy exit user with this email or user name',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  },

  InvalidPassword(): any {
    return new HttpException(
      {
        message: 'Invalid password',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  },

  DifferentPassword(): any {
    return new HttpException(
      {
        message: 'New password must different from old password',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  },
};
