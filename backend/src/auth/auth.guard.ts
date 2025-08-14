import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // ✅ VERIFY the Firebase token properly
      const decodedToken = await this.firebaseService.verifyToken(token);
      
      // Set verified user data from token
      request.user = { 
        uid: decodedToken.uid, 
        email: decodedToken.email,
        verified: decodedToken.verified,
        claims: decodedToken.claims
      };
      
      console.log(`✅ Token verified for user: ${decodedToken.email} (${decodedToken.uid})`);
      return true;
    } catch (error) {
      console.error('❌ AuthGuard failed:', error.message);
      throw new UnauthorizedException(`Invalid token: ${error.message}`);
    }
  }
}
