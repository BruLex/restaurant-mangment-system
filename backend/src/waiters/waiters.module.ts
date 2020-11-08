import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { WaitersService } from './waiters.service';
import { WaitersController } from './waiters.controller';
import { Waiter, WaiterSchema } from './schemas/waiter.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Waiter.name, schema: WaiterSchema }]),
  ],
  controllers: [WaitersController],
  providers: [WaitersService],
})
export class WaitersModule {}
