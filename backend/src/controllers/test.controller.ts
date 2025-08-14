import { Controller, Post, Get, Delete } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from '../schemas/account.schema';
import { Child, ChildDocument } from '../schemas/child.schema';
import { Device, DeviceDocument } from '../schemas/device.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Controller('test')
export class TestController {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    @InjectModel(Child.name) private childModel: Model<ChildDocument>,
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
  ) {}

  @Delete('clear-all-data')
  async clearAllData() {
    try {
      await this.userModel.deleteMany({});
      await this.accountModel.deleteMany({});
      await this.childModel.deleteMany({});
      await this.deviceModel.deleteMany({});
      
      return {
        success: true,
        message: 'All data cleared successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Get('ping')
  ping() {
    return { message: 'Test module is working!', timestamp: new Date() };
  }

  @Post('add-sample-data')
  async addSampleData() {
    try {
      // Create a sample user
      const user = new this.userModel({
        firebaseId: 'test_firebase_id_123',
        role: 'primary_parent',
        email: 'parent@example.com',
        firstName: 'John',
        lastName: 'Doe',
        mobileNumber: 1234567890,
        address: '123 Main St',
        pincode: 12345,
        avatar: 'https://example.com/avatar.jpg',
        settings: { theme: 'dark' },
        customClaims: { role: 'parent' },
      });
      const savedUser = await user.save();

      // Create a sample account
      const account = new this.accountModel({
        ownerUserId: savedUser._id,
        subscriptionPlan: 'premium',
        subscriptionStatus: 'active',
        subscriptionStart: new Date(),
        subscriptionEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      });
      const savedAccount = await account.save();

      // Update user with accountId
      await this.userModel.findByIdAndUpdate(savedUser._id, {
        accountId: savedAccount._id
      });

      // Create a sample child
      const child = new this.childModel({
        ownerUserId: savedUser._id,
        name: 'Alice Doe',
        dateOfBirth: new Date('2015-01-01'),
        age: 8,
        avatar: 'https://example.com/child-avatar.jpg',
        deviceId: 'device_123',
      });
      const savedChild = await child.save();

      // Create a sample device
      const device = new this.deviceModel({
        deviceId: 'device_123',
        childId: savedChild._id,
        ownerUserId: savedUser._id,
        model: 'Tablet Pro',
        serialNumber: 'SN123456789',
        deviceStatus: 'online',
        batteryLevel: 85,
        batteryThreshold: 20,
        screenTime: 120,
        preferences: { brightness: 'medium' },
        capabilities: { camera: true, gps: true },
        settings: { parentalControls: true },
      });
      const savedDevice = await device.save();

      return {
        success: true,
        message: 'Sample data added successfully',
        data: {
          user: savedUser,
          account: savedAccount,
          child: savedChild,
          device: savedDevice,
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Get('view-all-data')
  async viewAllData() {
    try {
      const users = await this.userModel.find().exec();
      const accounts = await this.accountModel.find().exec();
      const children = await this.childModel.find().exec();
      const devices = await this.deviceModel.find().exec();

      return {
        success: true,
        data: {
          users: users,
          accounts: accounts,
          children: children,
          devices: devices,
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}
