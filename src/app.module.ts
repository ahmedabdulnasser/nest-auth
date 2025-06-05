import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from 'process';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerMiddleware } from './middlwares/logger.middlware';
import { IsAuthenticatedMiddlware } from './middlwares/is-authenticated.middlware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      // imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.getOrThrow('MONGO_DB_URI');
        return {
          uri,
        };
      },
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/');
    consumer
      .apply(IsAuthenticatedMiddlware)
      .exclude(
        { path: '/auth/sign-up', method: RequestMethod.POST },
        { path: '/auth/sign-in', method: RequestMethod.POST },
      )
      .forRoutes('/');
  }
}
