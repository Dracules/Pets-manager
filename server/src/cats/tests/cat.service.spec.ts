import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CatService } from '../services/cat.service';
import { AnimalException } from '../../animal/exception_filters/exceptions/animal.exception';
import { mockCat, mockCatsList } from './mocks/cat.mock';
import type { CatResponse } from '../interfaces/cat.interface';
import { Types } from 'mongoose';

describe('CatService', () => {
  let service: CatService;

  interface MockQueryBuilder extends jest.Mock<any, any> {
    where: jest.Mock<MockQueryBuilder, [string, any]>;
    equals: jest.Mock<MockQueryBuilder, [any]>;
    populate: jest.Mock<MockQueryBuilder, [string]>;
    sort: jest.Mock<MockQueryBuilder, [any]>;
    skip: jest.Mock<MockQueryBuilder, [number]>;
    limit: jest.Mock<MockQueryBuilder, [number]>;
    lean: jest.Mock<MockQueryBuilder, []>;
    exec: jest.Mock<Promise<any>, []>;
  }

  function createMockQueryBuilder(): MockQueryBuilder {
    const mock = {
      where: jest.fn().mockReturnThis(),
      equals: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    };
    return mock as unknown as MockQueryBuilder;
  }

  type MockModel = jest.Mock & {
    find: jest.Mock;
    findById: jest.Mock;
    findByIdAndUpdate: jest.Mock;
    findByIdAndDelete: jest.Mock;
    where: jest.Mock;
    toJSON: jest.Mock;
    countDocuments: jest.Mock;
    exists: jest.Mock;
    modelName: string;
  };

  let mockCatModel: MockModel;

  beforeEach(async () => {
    mockCatModel = jest.fn().mockImplementation((data: object) => ({
      ...data,
      toJSON: jest.fn().mockReturnValue(data),
    })) as MockModel;

    mockCatModel.find = jest.fn();
    mockCatModel.findById = jest.fn();
    mockCatModel.findByIdAndUpdate = jest.fn();
    mockCatModel.findByIdAndDelete = jest.fn();
    mockCatModel.countDocuments = jest.fn();
    mockCatModel.modelName = 'Cat';
    mockCatModel.toJSON = jest.fn();
    mockCatModel.exists = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatService,
        { provide: getModelToken('Cat'), useValue: mockCatModel },
      ],
    }).compile();

    service = module.get<CatService>(CatService);
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

      mockCatModel.mockImplementation(() => ({
        save: saveMock,
      }));

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

      const mockQuery = createMockQueryBuilder();
      mockQuery.exec = jest
        .fn<Promise<any>, []>()
        .mockResolvedValue(mockCatsPage);

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
    describe('existent cat id', () => {
      it('must return cat with ID', async () => {
        const catId = '694ac1f93b5320db21a572a5';
        const userId = '694ac1f93b5320db21a572a5';
        const cat: CatResponse & { login: string } = {
          ...mockCat({ _id: catId }),
          login: 'string',
        };

        mockCatModel.exists = jest.fn().mockResolvedValue({ _id: catId });

        const mockQuery = createMockQueryBuilder();
        mockQuery.exec = jest.fn<Promise<any>, []>().mockResolvedValue(cat);

        mockCatModel.findById = jest.fn().mockReturnValue(mockQuery);

        const result = await service.findById(catId, userId);

        expect(mockCatModel.findById).toHaveBeenCalledWith(catId);
        expect(result).toEqual(cat);
      });
    });

    describe('nonexistent cat id', () => {
      it('must throw AnimalException', async () => {
        const nonExistentId = '999999999999999999999999';
        const userId = '694ac1f93b5320db21a572a5';

        mockCatModel.exists = jest.fn().mockResolvedValue(null);

        await expect(service.findById(nonExistentId, userId)).rejects.toThrow(
          AnimalException,
        );

        expect(mockCatModel.findById).not.toHaveBeenCalled();
      });
    });

    describe('animal does not belong to user', () => {
      it('must throw AnimalException', async () => {
        const catId = '694ac1f93b5320db21a572a5';
        const userId = '694ac1f93b5320db21a572a5';

        mockCatModel.exists.mockResolvedValue(null);

        await expect(service.findById(catId, userId)).rejects.toThrow(
          AnimalException,
        );
        expect(mockCatModel.exists).toHaveBeenCalledWith({
          _id: catId,
          owner: expect.any(Object) as unknown as Types.ObjectId,
        });

        expect(mockCatModel.findById).not.toHaveBeenCalled();
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

        const mockQuery = createMockQueryBuilder();
        mockQuery.exec = jest
          .fn<Promise<any>, []>()
          .mockResolvedValue(mockCatsPage);

        const mockQuery2 = createMockQueryBuilder();
        mockQuery2.exec = jest
          .fn<Promise<any>, []>()
          .mockResolvedValue(cats.length);

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

        const mockQuery = createMockQueryBuilder();
        mockQuery.exec = jest.fn<Promise<any>, []>().mockResolvedValue(cats);

        const mockQuery2 = createMockQueryBuilder();
        mockQuery2.exec = jest
          .fn<Promise<any>, []>()
          .mockResolvedValue(cats.length);

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

        mockCatModel.exists = jest.fn().mockResolvedValue({ _id: catId });

        mockCatModel.findByIdAndUpdate = jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue({ toJSON: () => updatedCat }),
        });

        const result = await service.updateById(userId, catId, newData);

        expect(mockCatModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);

        expect(mockCatModel.findByIdAndUpdate).toHaveBeenCalledWith(
          catId,
          expect.objectContaining({
            name: 'Bart',
            birthDate: newData.birthDate,
          }),
          { new: true, runValidators: true },
        );

        expect(result).toEqual(updatedCat);
      });
    });

    describe('updateById with undefined fields', () => {
      it('must add $unset for undefined fields and remove them from update object', async () => {
        const catId = '694ac1f93b5320db21a572a5';
        const userId = '694ac1f93b5320db21a11111';

        const newData: Partial<CatResponse> = {
          name: 'Bart',
          description: undefined,
        };

        const updatedCat = mockCat({ _id: catId, name: 'Bart' });

        mockCatModel.exists = jest.fn().mockResolvedValue({ _id: catId });

        mockCatModel.findByIdAndUpdate = jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue({ toJSON: () => updatedCat }),
        });

        const result = await service.updateById(userId, catId, newData);

        expect(mockCatModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
        expect(mockCatModel.findByIdAndUpdate).toHaveBeenCalledWith(
          catId,
          {
            name: 'Bart',
            $unset: {
              description: 1,
            },
          },
          { new: true, runValidators: true },
        );

        expect(result).toEqual(updatedCat);
      });
    });

    describe('nonexistent cat id', () => {
      it('must throw AnimalException', async () => {
        const nonExistentCatId = '999999999999999999999999';
        const userId = '694ac1f93b5320db21a11111';

        const newData: Partial<CatResponse> = {};

        mockCatModel.exists = jest.fn().mockResolvedValue(null);

        await expect(
          service.updateById(userId, nonExistentCatId, newData),
        ).rejects.toThrow(AnimalException);

        expect(mockCatModel.findByIdAndUpdate).toHaveBeenCalledTimes(0);
        expect(mockCatModel.exists).toHaveBeenCalledTimes(1);
      });
    });

    describe('nonexistent user id', () => {
      it('must throw AnimalException', async () => {
        const catId = '694ac1f93b5320db21a11111';
        const nonExistentUserId = '999999999999999999999999';

        const newData: Partial<CatResponse> = {};

        mockCatModel.exists = jest.fn().mockResolvedValue(null);

        await expect(
          service.updateById(nonExistentUserId, catId, newData),
        ).rejects.toThrow(AnimalException);

        expect(mockCatModel.findByIdAndUpdate).toHaveBeenCalledTimes(0);
        expect(mockCatModel.exists).toHaveBeenCalledTimes(1);
      });
    });

    describe('findByIdAndUpdate returns null (defensive branch)', () => {
      it('must throw AnimalException', async () => {
        const catId = '694ac1f93b5320db21a572a5';
        const userId = '694ac1f93b5320db21a11111';
        const newData: Partial<CatResponse> = {};

        mockCatModel.exists = jest.fn().mockResolvedValue({ _id: catId });

        mockCatModel.findByIdAndUpdate = jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        });

        await expect(
          service.updateById(userId, catId, newData),
        ).rejects.toThrow(AnimalException);

        expect(mockCatModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      });
    });

    describe('animal does not belong to user', () => {
      it('must throw AnimalException', async () => {
        const catId = '694ac1f93b5320db21a572a5';
        const userId = '694ac1f93b5320db21a11111';

        const newData: Partial<CatResponse> = {
          name: 'Bart',
          birthDate: new Date(),
        };

        mockCatModel.exists.mockResolvedValue(null);

        await expect(
          service.updateById(userId, catId, newData),
        ).rejects.toThrow(AnimalException);
        expect(mockCatModel.exists).toHaveBeenCalledWith({
          _id: catId,
          owner: expect.any(Object) as unknown as Types.ObjectId,
        });

        expect(mockCatModel.findByIdAndUpdate).not.toHaveBeenCalled();
      });
    });
  });

  describe('delete', () => {
    describe('existent cat id and user id', () => {
      it('must delete cat with ID and return void', async () => {
        const catId = '694ac1f93b5320db21a572a5';
        const userId = '694ac1f93b5320db21a11111';

        const deletedCat = mockCat({ _id: catId });

        mockCatModel.exists = jest.fn().mockResolvedValue({ _id: catId });

        mockCatModel.findByIdAndDelete = jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(deletedCat),
        });

        const result = await service.delete(userId, catId);

        expect(mockCatModel.exists).toHaveBeenCalledTimes(1);
        expect(mockCatModel.exists).toHaveBeenCalledWith({
          _id: catId,
          owner: expect.any(Object) as unknown as Types.ObjectId,
        });
        expect(mockCatModel.findByIdAndDelete).toHaveBeenCalledTimes(1);
        expect(mockCatModel.findByIdAndDelete).toHaveBeenCalledWith(catId);
        expect(result).toBeUndefined();
      });
    });

    describe('nonexistent cat id', () => {
      it('must throw AnimalException', async () => {
        const nonExistentCatId = '999999999999999999999999';
        const userId = '694ac1f93b5320db21a11111';

        mockCatModel.exists = jest.fn().mockResolvedValue(null);

        await expect(service.delete(userId, nonExistentCatId)).rejects.toThrow(
          AnimalException,
        );

        expect(mockCatModel.exists).toHaveBeenCalledTimes(1);
        expect(mockCatModel.findByIdAndDelete).toHaveBeenCalledTimes(0);
      });
    });

    describe('nonexistent user id', () => {
      it('must throw AnimalException', async () => {
        const catId = '694ac1f93b5320db21a11111';
        const nonExistentUserId = '999999999999999999999999';

        mockCatModel.exists = jest.fn().mockResolvedValue(null);

        await expect(service.delete(nonExistentUserId, catId)).rejects.toThrow(
          AnimalException,
        );

        expect(mockCatModel.exists).toHaveBeenCalledTimes(1);
        expect(mockCatModel.findByIdAndDelete).toHaveBeenCalledTimes(0);
      });
    });

    describe('findByIdAndDelete returns null (defensive branch)', () => {
      it('must throw AnimalException', async () => {
        const catId = '694ac1f93b5320db21a572a5';
        const userId = '694ac1f93b5320db21a11111';

        mockCatModel.exists = jest.fn().mockResolvedValue({ _id: catId });

        mockCatModel.findByIdAndDelete = jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        });

        await expect(service.delete(userId, catId)).rejects.toThrow(
          AnimalException,
        );

        expect(mockCatModel.findByIdAndDelete).toHaveBeenCalledTimes(1);
      });
    });

    describe('animal does not belong to user', () => {
      it('must throw AnimalException', async () => {
        const catId = '694ac1f93b5320db21a572a5';
        const userId = '694ac1f93b5320db21a11111';

        mockCatModel.exists.mockResolvedValue(null);

        await expect(service.delete(userId, catId)).rejects.toThrow(
          AnimalException,
        );
        expect(mockCatModel.exists).toHaveBeenCalledWith({
          _id: catId,
          owner: expect.any(Object) as unknown as Types.ObjectId,
        });

        expect(mockCatModel.findByIdAndDelete).not.toHaveBeenCalled();
      });
    });
  });
});
