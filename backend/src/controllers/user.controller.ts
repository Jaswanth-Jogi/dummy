import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UserController {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  @Post('create')
  async createUser(@Body() userData: any) {
    try {
      const newUser = new this.userModel({
        firebaseId: userData.firebaseId || `firebase_${Date.now()}`,
        role: userData.role || 'primary_parent',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        mobileNumber: userData.mobileNumber,
        address: userData.address,
        pincode: userData.pincode,
        avatar: userData.avatar,
        settings: userData.settings || {},
        customClaims: userData.customClaims || {},
      });

      const savedUser = await newUser.save();
      return { 
        success: true, 
        message: 'User created successfully', 
        user: savedUser 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message 
      };
    }
  }

  @Get('all')
  async getAllUsers() {
    try {
      const users = await this.userModel.find().exec();
      return { 
        success: true, 
        users: users 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message 
      };
    }
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async getUserProfile(@Request() req) {
    try {
      const user = await this.userModel.findOne({ firebaseId: req.user.uid });
      if (!user) {
        return { success: false, message: 'User not found' };
      }
      return { success: true, user: user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
