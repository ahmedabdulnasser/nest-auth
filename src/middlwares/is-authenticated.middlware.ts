import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class IsAuthenticatedMiddlware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const bearerToken = req.headers['authorization'];
    if (!bearerToken) {
      throw new UnauthorizedException();
    }

    const [, token] = bearerToken.split(' ');

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = jwt.verify(
        token,
        this.configService.getOrThrow<string>('JWT_SECRET'),
      );
      req['user'] = payload;
    } catch (err) {
      throw new UnauthorizedException();
    }
    // console.log(payload);

    next();
  }
}
