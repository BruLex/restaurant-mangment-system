import {
  Module,
  Injectable,
  NestMiddleware,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppService } from './app.service';
import { AdminsModule } from './admins';
import { OrdersModule } from './orders';
import { DishesModule } from './dishes';
import { WaitersModule } from './waiters';

import * as path from 'path';

const allowedExt: string[] = [
  '.js',
  '.ico',
  '.css',
  '.png',
  '.jpg',
  '.woff2',
  '.woff',
  '.ttf',
  '.svg',
];

const resolvePath = (file: string) => path.resolve(`../ui/dist/ui/${file}`);

@Injectable()
export class FrontendMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    if (
      ['admins', 'orders', 'waiters', 'dishes'].some(
        (prefix) => req.url.indexOf(prefix) === 1,
      )
    ) {
      next();
    } else if (
      allowedExt.filter((ext) => req.url.indexOf(ext) > 0).length > 0
    ) {
      // it has a file extension --> resolve the file
      // @ts-ignore
      res.sendFile(resolvePath(req.url));
    } else {
      // in all other cases, redirect to the index.html!
      // @ts-ignore
      res.sendFile(resolvePath('index.html'));
    }
  }
}

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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(FrontendMiddleware).forRoutes({
      path: '/**', // For all routes
      method: RequestMethod.GET, // For all methods
    });
  }
}
