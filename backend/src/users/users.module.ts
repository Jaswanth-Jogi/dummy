import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from '../controllers/user.controller';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    FirebaseModule, // Add this to provide FirebaseService for AuthGuard
  ],
  controllers: [UserController],
  exports: [MongooseModule],
})
export class UsersModule {}
