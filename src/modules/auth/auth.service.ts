import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
  ) {}
  async signUp(dto: SignUpDto) {
    const { email, password, age, fullName, mobileNumber } = dto;
    let user = await this.userModel.findOne({ email });
    if (user) {
      throw new ConflictException('This email exists.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    user = await this.userModel.create({
      email,
      password: hashedPassword,
      age,
      fullName,
      mobileNumber,
    });

    const { password: _password, ...result } = user.toObject();

    return result;
  }

  async signIn(dto: SignInDto) {
    const { email, password } = dto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Incorrect credentials.');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Incorrect credentials.');
    }
    const { email: returnedMail } = user.toObject();
    const payload = { email };
    const token = jwt.sign(
      payload,
      this.configService.getOrThrow<string>('JWT_SECRET'),
    );

    return {
      token,
    };
  }
}
