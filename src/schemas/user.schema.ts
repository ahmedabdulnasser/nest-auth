import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  fullName: string;

  @Prop()
  age: number;

  @Prop({ minlength: 11, match: /^01\d{9}$/ })
  mobileNumber: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
