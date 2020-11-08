import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminsModule } from './admins';
import { OrdersModule } from './orders';
import { DishesModule } from './dishes';
import { WaitersModule } from './waiters';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://rest-sys:dknuDInmoXBMtZxW@cluster0.8nzi7.mongodb.net/rest-sys-main?retryWrites=true&w=majority',
    ),
    ConfigModule.forRoot(),
    AdminsModule,
    DishesModule,
    WaitersModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
