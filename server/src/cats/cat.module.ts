import { Module } from '@nestjs/common';
import { CatController } from './controllers/cat.controller';
import { CatService } from './services/cat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatSchema } from './schemas/cat.schema';
import { AnimalCacheModule } from '../animal/controllers/animal.cache.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]),
    AnimalCacheModule,
  ],
  controllers: [CatController],
  providers: [CatService],
  exports: [MongooseModule],
})
export class CatModule {}
