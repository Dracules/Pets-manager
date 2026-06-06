import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnimalCacheModule } from '../animal/controllers/animal.cache.controller';
import { ParrotController } from './controllers/parrot.controller';
import { ParrotService } from './services/parrot.service';
import { Parrot, ParrotSchema } from './schemas/parrot.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Parrot.name, schema: ParrotSchema }]),
    AnimalCacheModule,
  ],
  controllers: [ParrotController],
  providers: [ParrotService],
  exports: [MongooseModule],
})
export class ParrotModule {}
