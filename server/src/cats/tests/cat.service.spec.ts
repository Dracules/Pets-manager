import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CatService } from '../services/cat.service';
import { AnimalException } from '../../animal/exception_filters/exceptions/animal.exception';
import { mockCat, mockCatsList } from './mocks/cat.mock';
import { CatResponse } from '../interfaces/cat.interface';
import { Types } from 'mongoose';

describe('CatService', () => {
  let service: CatService;

  type MockFnWithExec = jest.Mock<{ exec: jest.Mock }>;
  type MockFnWhereEquals = jest.Mock<{ equals: jest.Mock }>;
  type MockQueryBuilder<T = any> = {
    where: jest.MockedFunction<(...args: any[]) => MockQueryBuilder<T>>;
    equals: jest.MockedFunction<(...args: any[]) => MockQueryBuilder<T>>;
    populate: jest.MockedFunction<(...args: any[]) => MockQueryBuilder<T>>;
    sort: jest.MockedFunction<(...args: any[]) => MockQueryBuilder<T>>;
    skip: jest.MockedFunction<(...args: any[]) => MockQueryBuilder<T>>;
    limit: jest.MockedFunction<(...args: any[]) => MockQueryBuilder<T>>;
    lean: jest.MockedFunction<(...args: any[]) => MockQueryBuilder<T>>;
    exec: jest.MockedFunction<jest.Mock>;
  };

  interface MockModel extends jest.Mock {
    find: jest.MockedFunction<() => MockQueryBuilder>;
    findById: jest.MockedFunction<() => MockQueryBuilder>;
    findByIdAndUpdate: MockFnWithExec;
    findByIdAndDelete: MockFnWithExec;
    where: MockFnWhereEquals | jest.MockedFunction<() => MockQueryBuilder>;
    toJSON: jest.Mock;
    countDocuments: MockFnWithExec;
    modelName: string;
  }

  let mockCatModel: MockModel;

  beforeAll(async () => {
    mockCatModel = jest.fn() as MockModel;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatService,
        { provide: getModelToken('Cat'), useValue: mockCatModel },
      ],
    }).compile();

    service = module.get<CatService>(CatService);
    mockCatModel.modelName = 'Cat';
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('create new cat', async () => {
      const cat = mockCat();

      const userId = '507f1f77bcf86cd799439333';

      const savedCat = {
        ...cat,
        owner: userId,
      };

      const saveMock = jest.fn().mockResolvedValue({ toJSON: () => savedCat });

      mockCatModel.mockImplementation(() => {
        return {
          save: saveMock,
        };
      });

      const result = await service.create(cat, userId);

      expect(result).toEqual(savedCat);
      expect(mockCatModel).toHaveBeenCalledTimes(1);
      expect(mockCatModel).toHaveBeenLastCalledWith({
        ...cat,
        owner: new Types.ObjectId(userId),
      });
      expect(saveMock).toHaveBeenCalledTimes(1);
    });
  });
  /*
  describe('findAll', () => {
    it('return all cats', async () => {
      const mockCats = mockCatsList();
      const catType = 'cat';
      const mockCatsWithType = mockCats.map((obj) => ({
        ...obj,
        type: catType,
      }));
      mockCatModel.find = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(
          mockCats.map((cat) => ({
            toJSON: () => cat,
          })),
        ),
      }) as MockFnWithExec;

      const result = await service.findAll();
      expect(mockCatModel.find().exec).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCatsWithType);
    });
  });*/

  describe('findAll', () => {
    it('returns first page of cats with pagination', async () => {
      const mockCats = mockCatsList();
      const catType = 'cat';
      const limit = 2;
      const skip = 1;

      const mockCatsPage = mockCats.slice(skip, limit + skip);
      const mockCatsWithType = mockCatsPage.map((obj) => ({
        ...obj,
        type: catType,
      }));

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockCatsPage),
      } as any;

      mockCatModel.find = jest.fn().mockReturnValue(mockQuery);
      mockCatModel.countDocuments = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCats.length),
      });

      mockCatModel.modelName = 'cat';

      const result = await service.findAll(limit, skip);

      expect(result).toEqual({
        animals: mockCatsWithType,
        totalCount: mockCats.length,
      });

      expect(mockCatModel.find).toHaveBeenCalled();
      expect(mockCatModel.countDocuments).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    describe('existent id', () => {
      it('must return cat with ID', async () => {
        const catId = '694ac1f93b5320db21a572a5';
        const cat: CatResponse & { login: string } = {
          ...mockCat({ _id: catId }),
          login: 'string',
        };

        const mockQuery = {
          populate: jest.fn().mockReturnThis(),
          lean: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue(cat),
        } as any;

        mockCatModel.findById = jest.fn().mockReturnValue(mockQuery);

        const result = await service.findById(catId);

        expect(mockCatModel.findById).toHaveBeenCalledWith(catId);
        expect(result).toEqual(cat);
      });
    });

    describe('nonexistent id', () => {
      it('must throw AnimalException', async () => {
        const nonExistentId = '999999999999999999999999';

        const mockQuery = {
          populate: jest.fn().mockReturnThis(),
          lean: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue(null),
        } as any;

        mockCatModel.findById = jest.fn().mockReturnValue(mockQuery);

        await expect(service.findById(nonExistentId)).rejects.toThrow(
          AnimalException,
        );

        expect(mockCatModel.findById).toHaveBeenCalledWith(nonExistentId);
      });
    });
  });

  describe('findByUser', () => {
    describe('existent user id', () => {
      it('must return cats of user', async () => {
        const userId = '694ac1f93b5320db21a572a5';
        const userLogin = 'login';
        const cats: CatResponse[] = mockCatsList(5);
        const catType = 'cat';

        const limit = 2;
        const skip = 0;

        const mockCatsPage = cats.slice(skip, limit);

        const mockCatsWithType = mockCatsPage.map((obj) => {
          obj.owner = { _id: userId, login: userLogin };
          return {
            ...obj,
            type: catType,
          };
        });

        const mockQuery = {
          equals: jest.fn().mockReturnThis(),
          populate: jest.fn().mockReturnThis(),
          sort: jest.fn().mockReturnThis(),
          skip: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          lean: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue(mockCatsPage),
        } as any;

        const mockQuery2 = {
          where: jest.fn().mockReturnThis(),
          equals: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue(cats.length),
        } as any;

        mockCatModel.where = jest.fn().mockReturnValue(mockQuery);
        mockCatModel.countDocuments = jest.fn().mockReturnValue(mockQuery2);

        const result = await service.findByUser(userId, limit, skip);

        expect(result).toEqual({
          animals: mockCatsWithType,
          totalCount: cats.length,
        });

        expect(mockCatModel.where).toHaveBeenCalledTimes(1);
        expect(mockCatModel.countDocuments).toHaveBeenCalled();
      });
    });

    describe('nonexistent user id', () => {
      it('must return empty array', async () => {
        const nonExistentId = '999999999999999999999999';
        const cats: CatResponse[] = [];
        const limit = 2;
        const skip = 0;

        const mockQuery = {
          equals: jest.fn().mockReturnThis(),
          populate: jest.fn().mockReturnThis(),
          sort: jest.fn().mockReturnThis(),
          skip: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          lean: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue(cats),
        } as any;

        const mockQuery2 = {
          where: jest.fn().mockReturnThis(),
          equals: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue(cats.length),
        } as any;

        mockCatModel.where = jest.fn().mockReturnValue(mockQuery);
        mockCatModel.countDocuments = jest.fn().mockReturnValue(mockQuery2);

        const result = await service.findByUser(nonExistentId, limit, skip);

        expect(mockCatModel.where).toHaveBeenCalledTimes(1);
        expect(result).toEqual({
          animals: cats,
          totalCount: 0,
        });
      });
    });
  });

  describe('updateById', () => {
    describe('existent cat id and user id', () => {
      it('must return cat with ID and new data', async () => {
        const catId = '694ac1f93b5320db21a572a5';
        const userId = '694ac1f93b5320db21a11111';

        const newData: Partial<CatResponse> = {
          name: 'Bart',
          birthDate: new Date(),
        };

        const updatedCat = mockCat(newData);

        mockCatModel.where = jest.fn().mockReturnValue({
          equals: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              equals: jest.fn().mockResolvedValue({ length: 1 }),
            }) as MockFnWhereEquals,
          }),
        }) as MockFnWhereEquals;

        mockCatModel.findByIdAndUpdate = jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue({ toJSON: () => updatedCat }),
        }) as MockFnWithExec;

        const result = await service.updateById(userId, catId, newData);

        expect(mockCatModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
        expect(mockCatModel.findByIdAndUpdate).toHaveBeenCalledWith(
          catId,
          newData,
          { new: true, runValidators: true },
        );
        expect(mockCatModel.findByIdAndUpdate().exec).toHaveBeenCalledTimes(1);
        expect(result).toEqual(updatedCat);
      });
    });

    describe('nonexistent cat id', () => {
      it('must throw AnimalException', async () => {
        const nonExistentCatId = '999999999999999999999999';
        const userId = '694ac1f93b5320db21a11111';

        const newData: Partial<CatResponse> = {};

        mockCatModel.where = jest.fn().mockReturnValue({
          equals: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              equals: jest.fn().mockResolvedValue({ length: 0 }),
            }) as MockFnWhereEquals,
          }),
        }) as MockFnWhereEquals;

        await expect(
          service.updateById(userId, nonExistentCatId, newData),
        ).rejects.toThrow(AnimalException);

        expect(mockCatModel.findByIdAndUpdate).toHaveBeenCalledTimes(0);
        expect(mockCatModel.where).toHaveBeenCalledTimes(1);
      });
    });

    describe('nonexistent user id', () => {
      it('must throw AnimalException', async () => {
        const catId = '694ac1f93b5320db21a11111';
        const nonExistentUserId = '999999999999999999999999';

        const newData: Partial<CatResponse> = {};

        mockCatModel.where = jest.fn().mockReturnValue({
          equals: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              equals: jest.fn().mockResolvedValue({ length: 0 }),
            }) as MockFnWhereEquals,
          }),
        }) as MockFnWhereEquals;

        await expect(
          service.updateById(nonExistentUserId, catId, newData),
        ).rejects.toThrow(AnimalException);

        expect(mockCatModel.findByIdAndUpdate).toHaveBeenCalledTimes(0);
        expect(mockCatModel.where).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('delete', () => {
    describe('existent cat id and user id', () => {
      it('must delete cat with ID and return hardcoded string', async () => {
        const catId = '694ac1f93b5320db21a572a5';
        const userId = '694ac1f93b5320db21a11111';

        const deletedCat = mockCat({ _id: catId });

        const expectedResponse = 'Selected item is deleted successfully!';

        mockCatModel.where = jest.fn().mockReturnValue({
          equals: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              equals: jest.fn().mockResolvedValue({ length: 1 }),
            }) as MockFnWhereEquals,
          }),
        }) as MockFnWhereEquals;

        mockCatModel.findByIdAndDelete = jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(deletedCat),
        }) as MockFnWithExec;

        const result = await service.delete(userId, catId);

        expect(mockCatModel.where).toHaveBeenCalledTimes(1);
        expect(mockCatModel.findByIdAndDelete).toHaveBeenCalledTimes(1);
        expect(mockCatModel.findByIdAndDelete).toHaveBeenCalledWith(catId);
        expect(mockCatModel.findByIdAndDelete().exec).toHaveBeenCalledTimes(1);
        expect(result).toEqual(expectedResponse);
      });
    });

    describe('nonexistent cat id', () => {
      it('must throw AnimalException', async () => {
        const nonExistentCatId = '999999999999999999999999';
        const userId = '694ac1f93b5320db21a11111';

        mockCatModel.where = jest.fn().mockReturnValue({
          equals: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              equals: jest.fn().mockResolvedValue({ length: 0 }),
            }) as MockFnWhereEquals,
          }),
        }) as MockFnWhereEquals;

        await expect(service.delete(userId, nonExistentCatId)).rejects.toThrow(
          AnimalException,
        );

        expect(mockCatModel.where).toHaveBeenCalledTimes(1);
        expect(mockCatModel.findByIdAndDelete).toHaveBeenCalledTimes(0);
      });
    });

    describe('nonexistent user id', () => {
      it('must throw AnimalException', async () => {
        const catId = '694ac1f93b5320db21a11111';
        const nonExistentUserId = '999999999999999999999999';

        mockCatModel.where = jest.fn().mockReturnValue({
          equals: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              equals: jest.fn().mockResolvedValue({ length: 0 }),
            }) as MockFnWhereEquals,
          }),
        }) as MockFnWhereEquals;

        await expect(service.delete(nonExistentUserId, catId)).rejects.toThrow(
          AnimalException,
        );

        expect(mockCatModel.where).toHaveBeenCalledTimes(1);
        expect(mockCatModel.findByIdAndDelete).toHaveBeenCalledTimes(0);
      });
    });
  });
});
