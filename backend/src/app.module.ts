import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppService } from './app.service';
import { AdminsModule } from './admins';
import { OrdersModule } from './orders';
import { DishesModule } from './dishes';
import { WaitersModule } from './waiters';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: async (configService: ConfigService) => {
        return {
          uri: `mongodb+srv://${configService.get<string>(
            'DATABASE_USER',
          )}:${configService.get<string>(
            'DATABASE_PASSWORD',
          )}@${configService.get<string>(
            'DATABASE_URL',
          )}?retryWrites=true&w=majority`,
        };
      },
    }),
    ConfigModule.forRoot(),
    AdminsModule,
    DishesModule,
    WaitersModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
