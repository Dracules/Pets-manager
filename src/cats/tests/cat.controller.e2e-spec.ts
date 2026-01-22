import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CatDTO } from '../dto/cat.dto';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mongoose, { Connection, InsertManyResult } from 'mongoose';
import { Collection, ObjectId } from 'mongodb';
import { AppModule } from '../../app.module';
import { mockCatDTOList } from './mocks/cat.mock';
import { Cat } from '../interfaces/cat.interface';

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

  async function populateCatsDB(
    catsArray: CatDTO[],
  ): Promise<InsertManyResult<Document>> {
    const catsCollection = collections?.find(
      (collection) => collection.collectionName === 'cats',
    );
    if (!catsCollection) {
      throw Error('Cats collection not found');
    }

    return await catsCollection.insertMany(catsArray);
  }

  async function findCatDB(id: ObjectId): Promise<any> {
    const catsCollection = collections?.find(
      (collection) => collection.collectionName === 'cats',
    );
    if (!catsCollection) {
      throw Error('Cats collection not found');
    }

    return await catsCollection.findOne({
      _id: id,
    });
  }

  async function findAllCatsDB(): Promise<any> {
    const catsCollection = collections?.find(
      (collection) => collection.collectionName === 'cats',
    );
    if (!catsCollection) {
      throw Error('Cats collection not found');
    }

    return await catsCollection.find({}).toArray();
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

  beforeEach(async () => {
    if (!collections) collections = await mongooseConnection.db?.collections();
    await cleanupDB();
  });

  describe('getCats', () => {
    it('200 - without auth', async () => {
      await request(app.getHttpServer()).get('/animals/cats/').expect(200);
    });
    it('200 - user role', async () => {
      await request(app.getHttpServer())
        .get('/animals/cats/')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);
    });
    it('200 - admin role', async () => {
      await request(app.getHttpServer())
        .get('/animals/cats/')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
    it('gets all from DB', async () => {
      const cats = mockCatDTOList(5);
      const catsDeepCopy = JSON.parse(JSON.stringify(cats)) as CatDTO[];
      await populateCatsDB(cats);
      await request(app.getHttpServer())
        .get('/animals/cats/')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const allCatsDB = (await findAllCatsDB()) as Cat[];
      expect(allCatsDB.length).toBe(cats.length);
      catsDeepCopy.forEach((catDto) => {
        expect(allCatsDB).toContainEqual(expect.objectContaining(catDto));
      });
    });
  });
});
