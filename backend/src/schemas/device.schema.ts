import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DeviceDocument = Device & Document;

@Schema({ timestamps: true })
export class Device {
  @Prop({ required: true, unique: true })
  deviceId: string;

  @Prop({ type: Types.ObjectId, ref: 'Child' })
  childId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  ownerUserId: Types.ObjectId;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  serialNumber: string;

  @Prop({ required: true })
  deviceStatus: string;

  @Prop({ required: true })
  batteryLevel: number;

  @Prop({ required: true })
  batteryThreshold: number;

  @Prop({ required: true })
  screenTime: number;

  @Prop({ type: Object })
  preferences: Record<string, any>;

  @Prop({ type: Object })
  capabilities: Record<string, any>;

  @Prop({ type: Object })
  settings: Record<string, any>;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
