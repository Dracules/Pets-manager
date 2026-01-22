import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CatDTO } from '../dto/cat.dto';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mongoose, { Connection, InsertManyResult, Types } from 'mongoose';
import { Collection, ObjectId } from 'mongodb';
import { AppModule } from '../../app.module';
import { mockCatDTO, mockCatDTOList } from './mocks/cat.mock';
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

  describe('getCatById', () => {
    it('401 - valid catId without auth', async () => {
      const catId = new Types.ObjectId().toHexString();

      await request(app.getHttpServer())
        .get(`/animals/cats/${catId}`)
        .send()
        .expect(401);
    });

    it('200 - valid catId and user role', async () => {
      const cats = mockCatDTOList(1);
      const catId = (await populateCatsDB(cats)).insertedIds[0];

      await request(app.getHttpServer())
        .get(`/animals/cats/${catId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send()
        .expect(200);
    });

    it('200 - valid catId and admin role', async () => {
      const cats = mockCatDTOList(1);
      const catId = (await populateCatsDB(cats)).insertedIds[0];

      await request(app.getHttpServer())
        .get(`/animals/cats/${catId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send()
        .expect(200);
    });

    it('400 - invalid catId', async () => {
      const invalidId = '1';

      await request(app.getHttpServer())
        .get(`/animals/cats/${invalidId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send()
        .expect(400);
    });

    it('404 (Animal exception) - valid nonexistent catId', async () => {
      const invalidId = '111111111111111111111111';

      const response = await request(app.getHttpServer())
        .get(`/animals/cats/${invalidId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send()
        .expect(404);

      const error = response.body.message;

      expect(error).toEqual('Animal is not found. Check id.');
    });

    it('gets by id from DB', async () => {
      const cats = mockCatDTOList(1);
      const catId = (await populateCatsDB(cats)).insertedIds[0];

      const response = await request(app.getHttpServer())
        .get(`/animals/cats/${catId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send()
        .expect(200);

      const { _id, ...findedCat } = await findCatDB(catId);

      expect(response.body).not.toBeNull();
      expect(response.body).toMatchObject({
        ...findedCat,
        id: _id.toString(),
      });
    });
  });

  describe('createCat', () => {
    it('401 - valid CatDTO without auth', async () => {
      const correctCatDTO: CatDTO = mockCatDTO();

      await request(app.getHttpServer())
        .post('/animals/cats/')
        .send(correctCatDTO)
        .expect(401);
    });

    it('201 - valid CatDTO and user role', async () => {
      const correctCatDTO: CatDTO = mockCatDTO();

      await request(app.getHttpServer())
        .post('/animals/cats/')
        .set('Authorization', `Bearer ${userToken}`)
        .send(correctCatDTO)
        .expect(201);
    });

    it('201 - valid CatDTO and admin role', async () => {
      const correctCatDTO: CatDTO = mockCatDTO();

      await request(app.getHttpServer())
        .post('/animals/cats/')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(correctCatDTO)
        .expect(201);
    });

    it('201 - catDTO without LitterStatus', async () => {
      const catDTOWithoutLitterStatus: Partial<CatDTO> = {
        name: 'Bars',
        age: 3,
      };

      const response = await request(app.getHttpServer())
        .post('/animals/cats/')
        .set('Authorization', `Bearer ${userToken}`)
        .send(catDTOWithoutLitterStatus)
        .expect(201);

      const createdCat = response.body as CatDTO;
      expect(createdCat.litterStatus).toEqual('unknown');
    });

    it('400 - invalid catDTO', async () => {
      const catDTOWithIncorrectLitterStatus = mockCatDTO({
        name: 'B',
        age: -3,
      });

      await request(app.getHttpServer())
        .post('/animals/cats/')
        .set('Authorization', `Bearer ${userToken}`)
        .send(catDTOWithIncorrectLitterStatus)
        .expect(400);
    });

    it('creates in DB', async () => {
      const correctCatDTO: CatDTO = mockCatDTO();

      const response = await request(app.getHttpServer())
        .post('/animals/cats/')
        .set('Authorization', `Bearer ${userToken}`)
        .send(correctCatDTO)
        .expect(201);

      const createdCat = response.body as Cat;

      const findedCat = (await findCatDB(new ObjectId(createdCat.id))) as Cat;
      expect(findedCat).not.toBeNull();
      expect(findedCat).toMatchObject(correctCatDTO);
    });
  });
});
