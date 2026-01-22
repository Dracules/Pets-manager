import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mongoose, { Connection } from 'mongoose';
import { AppModule } from '../../app.module';

describe('CatController', () => {
  let app: INestApplication;
  let mongooseConnection: Connection;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            uri: config.get<string>('MONGO_TEST_URI'),
          }),
        }),
        AppModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    {
      const configService = app.get(ConfigService);

      mongooseConnection = mongoose.createConnection(
        configService.get<string>('MONGO_TEST_URI')!,
      );
    }
  });
});
