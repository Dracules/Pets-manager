import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CatDTO } from '../dto/cat.dto';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mongoose, { Connection, InsertManyResult, Types } from 'mongoose';
import { Collection, ObjectId } from 'mongodb';
import { AppModule } from '../../app.module';
import { mockCatDTO, mockCatDTOList } from './mocks/cat.mock';
import type { CatResponse } from '../interfaces/cat.interface';
import { App } from 'supertest/types';
import { initMongoDB } from './mocks/init-mongo-for-tests';
import type { PaginationResult } from '../../animal/interfaces/pagination.result';

describe('CatController', () => {
  let app: INestApplication;
  let mongooseConnection: Connection;
  let collections: Collection[] | undefined;
  let adminToken: string, userToken: string;

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

  async function findCatDB(id: ObjectId) {
    const catsCollection = collections?.find(
      (collection) => collection.collectionName === 'cats',
    );
    if (!catsCollection) {
      throw Error('Cats collection not found');
    }

    const doc = await catsCollection.findOne({
      _id: id,
    });

    return JSON.parse(JSON.stringify(doc)) as CatResponse;
  }

  async function findAllCatsDB() {
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
          connectionName: 'TEST_CONNECTION',
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            uri: config.get<string>('MONGO_TEST_URI'),
          }),
        }),
        AppModule,
      ],
    })
      .overrideProvider(getConnectionToken())
      .useFactory({
        inject: [ConfigService],
        factory: (configService: ConfigService) => {
          const uri = configService.get<string>('MONGO_TEST_URI');
          return mongoose.createConnection(uri!);
        },
      })
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();

    {
      const configService = app.get(ConfigService);

      mongooseConnection = moduleRef.get<Connection>(
        getConnectionToken('TEST_CONNECTION'),
      );

      await initMongoDB(configService, mongooseConnection);

      const loginResAdmin = (await request(app.getHttpServer() as App)
        .post('/auth/login')
        .send({
          login: configService.get<string>('MONGODB_TEST_ADMIN_USER'),
          password: configService.get<string>('MONGODB_TEST_ADMIN_PASSWORD'),
        })
        .expect(200)) as {
        body: {
          access_token: string;
        };
      };

      adminToken = loginResAdmin.body.access_token;

      const loginResUser = (await request(app.getHttpServer() as App)
        .post('/auth/login')
        .send({
          login: configService.get<string>('MONGODB_TEST_USER'),
          password: configService.get<string>('MONGODB_TEST_PASSWORD'),
        })
        .expect(200)) as { body: { access_token: string } };

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
      await request(app.getHttpServer() as App)
        .get('/animals/cats/')
        .expect(200);
    });
    it('200 - user role', async () => {
      await request(app.getHttpServer() as App)
        .get('/animals/cats/')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);
    });
    it('200 - admin role', async () => {
      await request(app.getHttpServer() as App)
        .get('/animals/cats/')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
    it('gets all from DB', async () => {
      const cats = mockCatDTOList(5);
      const catsDeepCopy = structuredClone(cats) as CatDTO[];
      structuredClone;
      await populateCatsDB(cats);
      await request(app.getHttpServer() as App)
        .get('/animals/cats/')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const allCatsDB = (await findAllCatsDB()) as unknown as CatResponse[];
      expect(allCatsDB.length).toBe(cats.length);
      catsDeepCopy.forEach((catDto) => {
        expect(allCatsDB).toContainEqual(expect.objectContaining(catDto));
      });
    });
  });

  describe('getCatById', () => {
    describe('e2e-tests', () => {
      it('401 - valid catId without auth', async () => {
        const catId = new Types.ObjectId().toHexString();

        await request(app.getHttpServer() as App)
          .get(`/animals/cats/${catId}`)
          .send()
          .expect(401);
      });

      it('200 - valid catId and user role', async () => {
        const cats = mockCatDTOList(1);
        const catId = (await populateCatsDB(cats)).insertedIds[0];

        await request(app.getHttpServer() as App)
          .get(`/animals/cats/${catId.toString()}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send()
          .expect(200);
      });

      it('200 - valid catId and admin role', async () => {
        const cats = mockCatDTOList(1);
        const catId = (await populateCatsDB(cats)).insertedIds[0];

        await request(app.getHttpServer() as App)
          .get(`/animals/cats/${catId.toString()}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send()
          .expect(200);
      });

      it('400 - invalid catId', async () => {
        const invalidId = '1';

        await request(app.getHttpServer() as App)
          .get(`/animals/cats/${invalidId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send()
          .expect(400);
      });

      it('404 (Animal exception) - valid nonexistent catId', async () => {
        const invalidId = '111111111111111111111111';

        const response = (await request(app.getHttpServer() as App)
          .get(`/animals/cats/${invalidId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send()
          .expect(404)) as { body: { message: string } };

        const error = response.body.message;

        expect(error).toEqual('Animal is not found. Check id.');
      });

      it('gets by id from DB', async () => {
        const cats = mockCatDTOList(1);
        const catId = (await populateCatsDB(cats)).insertedIds[0];

        const response = await request(app.getHttpServer() as App)
          .get(`/animals/cats/${catId.toString()}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send()
          .expect(200);

        const findedCat = await findCatDB(catId);

        expect(response.body).not.toBeNull();
        console.table(response.body);
        console.table(findedCat);
        expect(response.body).toMatchObject(findedCat);
      });
    });

    describe('integration-tests', () => {
      let consoleSpy: jest.SpyInstance;

      beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      });

      const countConsoleLogs = (text: string) =>
        consoleSpy.mock.calls.filter(
          ([msg]: [unknown]) => typeof msg === 'string' && msg.includes(text),
        ).length;

      it('caches by url from DB', async () => {
        const cats = mockCatDTOList(1);
        const catId = (await populateCatsDB(cats)).insertedIds[0];

        expect(countConsoleLogs('Take cache')).toBe(0);
        expect(countConsoleLogs('Put cache')).toBe(0);

        await request(app.getHttpServer() as App)
          .get(`/animals/cats/${catId.toString()}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send();

        expect(countConsoleLogs('Take cache')).toBe(0);
        expect(countConsoleLogs('Put cache')).toBe(1);

        await request(app.getHttpServer() as App)
          .get(`/animals/cats/${catId.toString()}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send();

        expect(countConsoleLogs('Take cache')).toBe(1);
        expect(countConsoleLogs('Put cache')).toBe(1);

        await request(app.getHttpServer() as App)
          .get(`/animals/cats/${catId.toString()}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send();

        expect(countConsoleLogs('Take cache')).toBe(2);
        expect(countConsoleLogs('Put cache')).toBe(1);
      });
    });
  });

  describe('getCatByUser', () => {
    it('401 - without auth', async () => {
      await request(app.getHttpServer() as App)
        .get(`/animals/cats/user`)
        .send()
        .expect(401);
    });

    it('200 - user role', async () => {
      await request(app.getHttpServer() as App)
        .get(`/animals/cats/user`)
        .set('Authorization', `Bearer ${userToken}`)
        .send()
        .expect(200);
    });

    it('200 - admin role', async () => {
      await request(app.getHttpServer() as App)
        .get(`/animals/cats/user`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send()
        .expect(200);
    });

    it('gets by id from DB', async () => {
      const correctCatDTO: CatDTO = mockCatDTO();

      await request(app.getHttpServer() as App)
        .post('/animals/cats/')
        .set('Authorization', `Bearer ${userToken}`)
        .send(correctCatDTO)
        .expect(201);

      const userResponse = await request(app.getHttpServer() as App)
        .get(`/animals/cats/user`)
        .set('Authorization', `Bearer ${userToken}`)
        .send()
        .expect(200);

      const adminResponse = await request(app.getHttpServer() as App)
        .get(`/animals/cats/user`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send()
        .expect(200);

      const userResp = userResponse.body as PaginationResult<CatResponse[]>;
      const adminResp = adminResponse.body as PaginationResult<CatResponse[]>;

      expect(userResp.animals.length).toBe(1);
      expect(userResp.totalCount).toBe(1);
      expect(adminResp.animals.length).toBe(0);
      expect(adminResp.totalCount).toBe(0);
    });
  });

  describe('createCat', () => {
    it('401 - valid CatDTO without auth', async () => {
      const correctCatDTO: CatDTO = mockCatDTO();

      await request(app.getHttpServer() as App)
        .post('/animals/cats/')
        .send(correctCatDTO)
        .expect(401);
    });

    it('201 - valid CatDTO and user role', async () => {
      const correctCatDTO: CatDTO = mockCatDTO();

      await request(app.getHttpServer() as App)
        .post('/animals/cats/')
        .set('Authorization', `Bearer ${userToken}`)
        .send(correctCatDTO)
        .expect(201);
    });

    it('201 - valid CatDTO and admin role', async () => {
      const correctCatDTO: CatDTO = mockCatDTO();

      await request(app.getHttpServer() as App)
        .post('/animals/cats/')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(correctCatDTO)
        .expect(201);
    });

    it('201 - catDTO without LitterStatus', async () => {
      const catDTOWithoutLitterStatus: Partial<CatDTO> = {
        name: 'Bars',
        birthDate: new Date(),
      };

      const response = await request(app.getHttpServer() as App)
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
        birthDate: new Date(),
      });

      await request(app.getHttpServer() as App)
        .post('/animals/cats/')
        .set('Authorization', `Bearer ${userToken}`)
        .send(catDTOWithIncorrectLitterStatus)
        .expect(400);
    });

    it('creates in DB', async () => {
      const correctCatDTO: CatDTO = mockCatDTO();

      const response = await request(app.getHttpServer() as App)
        .post('/animals/cats/')
        .set('Authorization', `Bearer ${userToken}`)
        .send(correctCatDTO)
        .expect(201);

      const createdCat = response.body as CatResponse;

      const findedCat = await findCatDB(new ObjectId(createdCat._id));
      expect(findedCat).not.toBeNull();
      expect(findedCat).toMatchObject(
        JSON.parse(JSON.stringify(correctCatDTO)),
      );
    });
  });

  describe('updateCat', () => {
    it('401 - valid CatDTO and catId without auth', async () => {
      const correctCatDTO: Partial<CatDTO> = mockCatDTO();

      const catId = '694ac1f93b5320db21a572a5';

      await request(app.getHttpServer() as App)
        .put(`/animals/cats/${catId}`)
        .send(correctCatDTO)
        .expect(401);
    });

    it('200 - valid CatDTO, catId and user role', async () => {
      const correctCatDTO: CatDTO = mockCatDTO();

      const createResponse = await request(app.getHttpServer() as App)
        .post('/animals/cats/')
        .set('Authorization', `Bearer ${userToken}`)
        .send(correctCatDTO)
        .expect(201);

      const cat = createResponse.body as CatResponse;

      const newName = 'NewName';
      const updateCatDTO: Partial<CatDTO> = { name: newName };

      await request(app.getHttpServer() as App)
        .put(`/animals/cats/${cat._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateCatDTO)
        .expect(200);
    });

    it('200 - valid CatDTO, catId and admin role', async () => {
      const correctCatDTO: CatDTO = mockCatDTO();

      const createResponse = await request(app.getHttpServer() as App)
        .post('/animals/cats/')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(correctCatDTO)
        .expect(201);

      const cat = createResponse.body as CatResponse;

      const newName = 'NewName';
      const updateCatDTO: Partial<CatDTO> = { name: newName };

      await request(app.getHttpServer() as App)
        .put(`/animals/cats/${cat._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateCatDTO)
        .expect(200);
    });

    it('400 - invalid catDTO', async () => {
      const cats = mockCatDTOList(1);
      const catId = (await populateCatsDB(cats)).insertedIds[0];

      const catDTOWithIncorrectLitterStatus = mockCatDTO({
        name: 'B',
        birthDate: new Date(),
      });

      await request(app.getHttpServer() as App)
        .put(`/animals/cats/${catId.toString()}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(catDTOWithIncorrectLitterStatus)
        .expect(400);
    });

    it('400 - invalid catId', async () => {
      const cats = mockCatDTOList(1);
      await populateCatsDB(cats);
      const invalidId = '1';

      const correctCatDTO: Partial<CatDTO> = { name: 'newName' };

      await request(app.getHttpServer() as App)
        .put(`/animals/cats/${invalidId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(correctCatDTO)
        .expect(400);
    });

    it('404 (Animal exception) - valid nonexistent catId', async () => {
      const cats = mockCatDTOList(1);
      await populateCatsDB(cats);
      const invalidId = '111111111111111111111111';

      const correctCatDTO: Partial<CatDTO> = { name: 'newName' };

      const response = (await request(app.getHttpServer() as App)
        .put(`/animals/cats/${invalidId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(correctCatDTO)
        .expect(404)) as { body: { message: string } };

      const error = response.body.message;

      expect(error).toEqual('Animal is not found. Check id.');
    });

    it('404 (Animal exception) - user and cat id mismatch', async () => {
      const correctCatDTO: CatDTO = mockCatDTO();

      const createResponse = await request(app.getHttpServer() as App)
        .post('/animals/cats/')
        .set('Authorization', `Bearer ${userToken}`)
        .send(correctCatDTO)
        .expect(201);

      const cat = createResponse.body as CatResponse;

      const response = (await request(app.getHttpServer() as App)
        .put(`/animals/cats/${cat._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(correctCatDTO)
        .expect(404)) as { body: { message: string } };

      const error = response.body.message;

      expect(error).toEqual('Animal is not found. Check id.');
    });

    it('updates in DB', async () => {
      const correctCatDTO: CatDTO = mockCatDTO();

      const createResponse = await request(app.getHttpServer() as App)
        .post('/animals/cats/')
        .set('Authorization', `Bearer ${userToken}`)
        .send(correctCatDTO)
        .expect(201);

      const createdCat = createResponse.body as CatResponse;

      const newName = 'NewName';
      const updateCatDTO: Partial<CatDTO> = { name: newName };

      await request(app.getHttpServer() as App)
        .put(`/animals/cats/${createdCat._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateCatDTO)
        .expect(200);

      const findedCat = await findCatDB(new ObjectId(createdCat._id));
      expect(findedCat.name).toEqual(newName);
      expect(findedCat.name).not.toEqual(createdCat.name);
    });
  });

  describe('deleteCat', () => {
    it('401 - valid catId without auth', async () => {
      const catId = new Types.ObjectId().toHexString();

      await request(app.getHttpServer() as App)
        .delete(`/animals/cats/${catId}`)
        .send()
        .expect(401);
    });

    it('200 - valid catId and user role', async () => {
      const correctCatDTO: CatDTO = mockCatDTO();

      const createResponse = await request(app.getHttpServer() as App)
        .post('/animals/cats/')
        .set('Authorization', `Bearer ${userToken}`)
        .send(correctCatDTO)
        .expect(201);

      const cat = createResponse.body as CatResponse;

      await request(app.getHttpServer() as App)
        .delete(`/animals/cats/${cat._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send()
        .expect(200);
    });

    it('200 - valid catId and admin role', async () => {
      const correctCatDTO: CatDTO = mockCatDTO();

      const createResponse = await request(app.getHttpServer() as App)
        .post('/animals/cats/')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(correctCatDTO)
        .expect(201);

      const cat = createResponse.body as CatResponse;

      await request(app.getHttpServer() as App)
        .delete(`/animals/cats/${cat._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send()
        .expect(200);
    });

    it('400 - invalid catId', async () => {
      const invalidId = '1';

      await request(app.getHttpServer() as App)
        .delete(`/animals/cats/${invalidId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send()
        .expect(400);
    });

    it('404 (Animal exception) - valid nonexistent catId', async () => {
      const invalidId = '111111111111111111111111';

      const response = (await request(app.getHttpServer() as App)
        .delete(`/animals/cats/${invalidId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send()
        .expect(404)) as { body: { message: string } };

      const error = response.body.message;

      expect(error).toEqual('Animal is not found. Check id.');
    });

    it('404 (Animal exception) - user and cat id mismatch', async () => {
      const correctCatDTO: CatDTO = mockCatDTO();

      const createResponse = await request(app.getHttpServer() as App)
        .post('/animals/cats/')
        .set('Authorization', `Bearer ${userToken}`)
        .send(correctCatDTO)
        .expect(201);

      const cat = createResponse.body as CatResponse;

      const response = (await request(app.getHttpServer() as App)
        .delete(`/animals/cats/${cat._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send()
        .expect(404)) as { body: { message: string } };

      const error = response.body.message;

      expect(error).toEqual('Animal is not found. Check id.');
    });

    it('deletes from DB', async () => {
      const correctCatDTO: CatDTO = mockCatDTO();

      const createResponse = await request(app.getHttpServer() as App)
        .post('/animals/cats/')
        .set('Authorization', `Bearer ${userToken}`)
        .send(correctCatDTO)
        .expect(201);

      const cat = createResponse.body as CatResponse;

      const response = await request(app.getHttpServer() as App)
        .delete(`/animals/cats/${cat._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send()
        .expect(200);

      const findedCat = await findCatDB(new ObjectId(cat._id));
      expect(findedCat).toBeNull();
      expect(response.body).toEqual('Selected item is deleted successfully!');
    });
  });
});
