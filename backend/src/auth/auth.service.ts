import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { AccountService } from '../services/account.service';

@Injectable()
export class AuthService {
  constructor(
    private firebaseService: FirebaseService,
    private accountService: AccountService,
  ) {}

  async handleLogin(token: string) {
    try {
      console.log('🔄 Starting login process with token...');
      
      // 1. Verify Firebase token
      const decodedToken = await this.firebaseService.verifyToken(token);
      console.log('✅ Token verified for user:', decodedToken.email);
      
      // 2. Get user data from Firebase
      const firebaseUser = await this.firebaseService.getUserByUid(decodedToken.uid);
      console.log('✅ Firebase user data retrieved:', firebaseUser.email);
      
      // 3. Check/create user and account
      const result = await this.accountService.checkAccountOnLogin(
        decodedToken.uid,
        {
          email: firebaseUser.email,
          firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
          lastName: firebaseUser.displayName?.split(' ')[1] || 'Name',
          subscriptionPlan: 'premium',
          subscriptionStatus: 'active',
          mobileNumber: 1234567890,
          address: '123 Main Street',
          pincode: 12345,
          avatar: firebaseUser.photoURL || 'https://via.placeholder.com/150',
        }
      );

      console.log('✅ Account check result:', result.action);

      return {
        success: true,
        user: {
          uid: decodedToken.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
        },
        account: result,
        message: result.message
      };

    } catch (error) {
      console.error('❌ Login error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  async sendEmailVerification(uid: string) {
    try {
      return await this.firebaseService.sendEmailVerification(uid);
    } catch (error) {
      console.error('❌ Send email verification error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  async checkEmailVerification(uid: string) {
    try {
      return await this.firebaseService.checkEmailVerification(uid);
    } catch (error) {
      console.error('❌ Check email verification error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }
}
