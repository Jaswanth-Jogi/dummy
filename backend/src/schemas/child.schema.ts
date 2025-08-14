import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChildDocument = Child & Document;

@Schema({ timestamps: true })
export class Child {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  ownerUserId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ required: true })
  age: number;

  @Prop()
  avatar: string;

  @Prop({ required: true })
  deviceId: string;
}

export const ChildSchema = SchemaFactory.createForClass(Child);
