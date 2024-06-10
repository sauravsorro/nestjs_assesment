import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { AuthExceptions } from 'src/common/expections';
import { AUTH_IS_PUBLIC_KEY } from 'src/utils/constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret_key',
    });
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      AUTH_IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = request?.headers?.authorization?.split(' ')[1];
    const user = this.jwtService.decode(token) as any;
    if (user) {
      return true;
    }
  }

  handleRequest(err, user, info) {
    if (info?.name === 'TokenExpiredError') {
      throw AuthExceptions.TokenExpired();
    }

    if (info?.name === 'JsonWebTokenError') {
      throw AuthExceptions.InvalidToken();
    }

    if (err || !user) {
      console.log('40 err is::::::::::::::::::', err);
      console.log('40 user is::::::::::::::::::', user);

      throw err || AuthExceptions.ForbiddenException();
    }

    return user;
  }
}
