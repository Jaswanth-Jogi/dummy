import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TestModule } from './modules/test.module';
import { AccountModule } from './modules/account.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/dummy-back'),
    UsersModule,
    AuthModule,
    TestModule,
    AccountModule,
    FirebaseModule,
  ],
})
export class AppModule {}
