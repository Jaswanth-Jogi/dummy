import { auth } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  User
} from 'firebase/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const authService = {
  async signUp(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Send email verification
      await sendEmailVerification(user);
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async sendEmailVerification(user: User) {
    try {
      await sendEmailVerification(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async checkEmailVerification(uid: string, token: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/check-email-verification/${uid}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}; 