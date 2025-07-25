import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { IJwtPayload } from 'src/interfaces/jwt-payload.interface';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get('/')
  getAllUsers() {
    return this.service.getAllUsers();
  }
  @Get('/profile')
  getProfile(@Req() req: Request) {
    const user: IJwtPayload = req['user'];
    return this.service.getProfile(user);
  }

  @Post('/')
  addOneUser(@Body() dto: any) {
    return this.service.addOneUser(dto);
  }
}
