import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Account, AccountDocument } from '../schemas/account.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async checkAccountOnLogin(firebaseId: string, userData: any) {
    try {
      console.log('🔄 CheckAccountOnLogin: Starting with firebaseId:', firebaseId);
      
      // STEP 1: Check by firebaseId (primary identifier)
      let user = await this.userModel.findOne({ firebaseId });
      
      if (user) {
        console.log('✅ User found by firebaseId, checking account...');
        
        // Check if user already has an accountID
        if (user.accountId) {
          console.log('ℹ️ User already has account, returning existing account');
          return {
            success: true,
            message: 'Account already exists',
            accountId: user.accountId,
            action: 'abort'
          };
        }
      } else {
        console.log('🆕 User not found, creating new user...');
        
        // Create new user with firebaseId as primary identifier
        const newUser = new this.userModel({
          firebaseId: firebaseId,
          email: userData.email,
          firstName: userData.firstName || 'User',
          lastName: userData.lastName || 'Name',
          role: 'primary_parent',
          mobileNumber: userData.mobileNumber || 1234567890,
          address: userData.address || '123 Main Street',
          pincode: userData.pincode || 12345,
          avatar: userData.avatar || 'https://via.placeholder.com/150',
          settings: { theme: 'light' },
          customClaims: { role: 'parent' },
          lastLogin: new Date().toISOString()
        });

        user = await newUser.save();
        console.log('✅ New user created:', user._id);
      }

      // STEP 2: Create account if user doesn't have one
      if (!user.accountId) {
        console.log('🆕 Creating new account for user...');
        
        const newAccount = new this.accountModel({
          OwnerUserID: user._id,
          SubscriptionPlan: userData.subscriptionPlan || 'premium',
          SubscriptionStatus: userData.subscriptionStatus || 'active',
          SubscriptionStart: new Date(),
          SubscriptionEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          CreatedAT: new Date(),
          UpdatedAt: new Date(),
        });

        const savedAccount = await newAccount.save();
        console.log('✅ New account created:', savedAccount._id);

        // Link account to user
        await this.userModel.findByIdAndUpdate(user._id, {
          accountId: savedAccount._id
        });
        console.log('✅ User updated with accountId:', savedAccount._id);

        return {
          success: true,
          message: 'User and account created successfully and mapped',
          userId: user._id,
          accountId: savedAccount._id,
          action: 'created',
          data: {
            user: user,
            account: savedAccount
          }
        };
      }

      return {
        success: true,
        message: 'User and account already exist',
        userId: user._id,
        accountId: user.accountId,
        action: 'abort'
      };

    } catch (error) {
      console.error('❌ Error in CheckAccountOnLogin:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  async getAccountByUserId(userId: string) {
    try {
      console.log(`🔍 Looking for user with firebaseId: ${userId}`);

      // Search by firebaseId (since userId from token is firebaseId)
      let user = await this.userModel.findOne({ firebaseId: userId });

      if (!user) {
        console.log('❌ User not found by firebaseId');
        return null;
      }

      if (!user.accountId) {
        console.log('❌ User found but no account linked');
        return null;
      }

      const account = await this.accountModel.findById(user.accountId);
      console.log(`✅ Found account: ${account ? account._id : 'null'}`);

      return account;
    } catch (error) {
      console.error('❌ Error in getAccountByUserId:', error);
      return null;
    }
  }
}
