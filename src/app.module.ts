import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AnimalModule } from './animal.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { EverythingFilter } from './exception_filters/everything.exception.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [AnimalModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: EverythingFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
