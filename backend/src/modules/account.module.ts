import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from '../schemas/account.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { AccountService } from '../services/account.service';
import { AccountController } from '../controllers/account.controller';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: User.name, schema: UserSchema },
    ]),
    FirebaseModule, // Add this to provide FirebaseService for AuthGuard
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
