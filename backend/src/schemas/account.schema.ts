import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AccountDocument = Account & Document;

@Schema({ timestamps: true })
export class Account {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  OwnerUserID: Types.ObjectId;

  @Prop({ required: true })
  SubscriptionPlan: string;

  @Prop({ required: true })
  SubscriptionStatus: string;

  @Prop({ required: true })
  SubscriptionStart: Date;

  @Prop({ required: true })
  SubscriptionEnd: Date;

  @Prop({ required: true })
  CreatedAT: Date;

  @Prop({ required: true })
  UpdatedAt: Date;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
