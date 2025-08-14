import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  firebaseId: string;

  @Prop({ type: Types.ObjectId, ref: 'Account' })
  accountId: Types.ObjectId;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  mobileNumber: number;

  @Prop()
  updateTimeForPassword: string;

  @Prop()
  address: string;

  @Prop()
  pincode: number;

  @Prop()
  lastLogin: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  avatar: string;

  @Prop({ type: Object })
  settings: Record<string, any>;

  @Prop({ type: Object })
  customClaims: Record<string, any>;
}

export const UserSchema = SchemaFactory.createForClass(User);
