import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AccountService } from '../services/account.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('check-on-login')
  async checkAccountOnLogin(@Body() userData: any) {
    // Extract firebaseId from the request body
    const firebaseId = userData.firebaseId;
    if (!firebaseId) {
      return { success: false, message: 'firebaseId is required' };
    }
    
    return this.accountService.checkAccountOnLogin(firebaseId, userData);
  }

  @Post('get-account')
  @UseGuards(AuthGuard)
  async getAccount(@Request() req) {
    // ✅ Now using verified user data from token
    const userId = req.user.uid;
    console.log(`🔍 Getting account for verified user: ${req.user.email} (${userId})`);
    
    return this.accountService.getAccountByUserId(userId);
  }
}
