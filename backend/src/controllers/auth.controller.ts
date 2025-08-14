import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() { token }: { token: string }) {
    return this.authService.handleLogin(token);
  }

  @Post('send-email-verification')
  @UseGuards(AuthGuard)
  async sendEmailVerification(@Body() { uid }: { uid: string }) {
    return this.authService.sendEmailVerification(uid);
  }

  @Get('check-email-verification/:uid')
  @UseGuards(AuthGuard)
  async checkEmailVerification(@Param('uid') uid: string) {
    return this.authService.checkEmailVerification(uid);
  }
}
