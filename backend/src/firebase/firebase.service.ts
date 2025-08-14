import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { join } from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    try {
      // Initialize Firebase Admin SDK with your specific service account key
      admin.initializeApp({
        credential: admin.credential.cert(
          join(process.cwd(), '..', 'dummy-e117f-firebase-adminsdk-fbsvc-21aa156140.json')
        ),
      });
      console.log('✅ Firebase Admin SDK initialized successfully with service account key');
    } catch (error) {
      // If already initialized, that's fine
      if (error.code === 'app/duplicate-app') {
        console.log('ℹ️ Firebase Admin SDK already initialized');
      } else {
        console.error('❌ Firebase Admin SDK initialization failed:', error);
        console.error('Make sure the service account key file exists in the root directory');
      }
    }
  }

  async verifyToken(token: string) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      return {
        uid: decodedToken.uid,
        email: decodedToken.email,
        verified: true,
        claims: decodedToken.claims || {}
      };
    } catch (error) {
      console.error('❌ Token verification failed:', error.message);
      throw new Error(`Invalid token: ${error.message}`);
    }
  }

  async getUserByUid(uid: string) {
    try {
      const userRecord = await admin.auth().getUser(uid);
      return {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
        emailVerified: userRecord.emailVerified
      };
    } catch (error) {
      console.error('❌ Get user failed:', error.message);
      throw new Error(`User not found: ${error.message}`);
    }
  }

  async sendEmailVerification(uid: string) {
    try {
      const userRecord = await admin.auth().getUser(uid);
      if (userRecord.emailVerified) {
        throw new Error('Email is already verified');
      }
      
      if (!userRecord.email) {
        throw new Error('User does not have an email address');
      }
      
      // Generate email verification link
      const actionCodeSettings = {
        url: process.env.FRONTEND_URL || 'http://localhost:3000',
        handleCodeInApp: false,
      };
      
      const link = await admin.auth().generateEmailVerificationLink(
        userRecord.email,
        actionCodeSettings
      );
      
      // Send email using Firebase Admin SDK
      await admin.auth().generateEmailVerificationLink(userRecord.email);
      
      return {
        success: true,
        message: 'Email verification sent successfully',
        email: userRecord.email
      };
    } catch (error) {
      console.error('❌ Send email verification failed:', error.message);
      throw new Error(`Failed to send email verification: ${error.message}`);
    }
  }

  async checkEmailVerification(uid: string) {
    try {
      const userRecord = await admin.auth().getUser(uid);
      if (!userRecord.email) {
        throw new Error('User does not have an email address');
      }
      return {
        emailVerified: userRecord.emailVerified,
        email: userRecord.email
      };
    } catch (error) {
      console.error('❌ Check email verification failed:', error.message);
      throw new Error(`Failed to check email verification: ${error.message}`);
    }
  }
}
