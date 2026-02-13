import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Dog, DogSchema } from './schemas/dog.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Dog.name, schema: DogSchema }])],
})
export class DogModule {}
