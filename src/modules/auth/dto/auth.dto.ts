import { ApiProperty } from '@nestjs/swagger';
import { Matches, MinLength } from 'class-validator';

class BaseAuthDto {
  @ApiProperty({
    example: 'ahmed@iti.gov.eg',
  })
  email: string;

  @ApiProperty()
  @MinLength(8)
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Password must be alphanumeric.',
  })
  password: string;
}
export class SignInDto extends BaseAuthDto {}

export class SignUpDto extends BaseAuthDto {
  @ApiProperty()
  age: number;
  @ApiProperty()
  fullName: string;
  @ApiProperty()
  mobileNumber: string;
}
