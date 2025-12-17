import { Module } from '@nestjs/common';
import { AnimalModule } from './animal.module';

@Module({
  imports: [AnimalModule],
})
export class AppModule {}
