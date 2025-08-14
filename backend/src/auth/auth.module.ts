import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { FirebaseService } from '../firebase/firebase.service';
import { AccountService } from '../services/account.service';
import { AuthController } from '../controllers/auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Account, AccountSchema } from '../schemas/account.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Account.name, schema: AccountSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, FirebaseService, AccountService],
  exports: [AuthGuard, FirebaseService],
})
export class AuthModule {}
