import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AnimalModule } from './animal.module';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [AnimalModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
