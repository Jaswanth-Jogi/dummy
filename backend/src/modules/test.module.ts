import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from '../schemas/account.schema';
import { Child, ChildSchema } from '../schemas/child.schema';
import { Device, DeviceSchema } from '../schemas/device.schema';
import { TestController } from '../controllers/test.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: Child.name, schema: ChildSchema },
      { name: Device.name, schema: DeviceSchema },
    ]),
  ],
  controllers: [TestController],
})
export class TestModule {}
