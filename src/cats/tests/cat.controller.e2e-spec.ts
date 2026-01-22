import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mongoose, { Connection } from 'mongoose';
import { Collection } from 'mongodb';
import { AppModule } from '../../app.module';

describe('CatController', () => {
  let app: INestApplication;
  let mongooseConnection: Connection;
  let collections: Collection[] | undefined;
  let adminToken: any, userToken: any;

  async function cleanupDB(): Promise<void> {
    try {
      if (collections) {
        for (const collection of collections) {
          if (collection.collectionName !== 'users') {
            await collection.deleteMany();
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

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

      const loginResAdmin = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          login: configService.get<string>('MONGODB_TEST_ADMIN_USER'),
          password: configService.get<string>('MONGODB_TEST_ADMIN_PASSWORD'),
        })
        .expect(200);

      adminToken = loginResAdmin.body.access_token;

      const loginResUser = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          login: configService.get<string>('MONGODB_TEST_USER'),
          password: configService.get<string>('MONGODB_TEST_PASSWORD'),
        })
        .expect(200);

      userToken = loginResUser.body.access_token;
    }
  });

  afterAll(async () => {
    await cleanupDB();
    await mongooseConnection?.close();
    await app.close();
  });
});
