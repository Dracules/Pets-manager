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
  type MockFnWithPopulate = jest.Mock<{ populate: MockFnWithExec }>;
  type MockFnWhereEquals = jest.Mock<{ equals: jest.Mock }>;

  interface MockModel extends jest.Mock {
    find: MockFnWithExec;
    findById: MockFnWithExec | MockFnWithPopulate;
    findByIdAndUpdate: MockFnWithExec;
    findByIdAndDelete: MockFnWithExec;
    where: MockFnWhereEquals;
    toJSON: jest.Mock;
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
  });

  describe('findById', () => {
    describe('existent id', () => {
      it('must return cat with ID', async () => {
        const catId = '694ac1f93b5320db21a572a5';
        const cat: CatResponse & { login: string } = {
          ...mockCat({ _id: catId }),
          login: 'string',
        };

        const execFunc = jest.fn().mockResolvedValue({ toJSON: () => cat });
        mockCatModel.findById = jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({ exec: execFunc }),
        });

        const result = await service.findById(catId);

        expect(mockCatModel.findById).toHaveBeenCalledWith(catId);
        expect(execFunc).toHaveBeenCalledTimes(1);
        expect(result).toEqual(cat);
      });
    });

    describe('nonexistent id', () => {
      it('must throw AnimalException', async () => {
        const nonExistentId = '999999999999999999999999';

        const execFunc = jest.fn().mockResolvedValue(null);
        mockCatModel.findById = jest.fn().mockReturnValue({
          populate: jest
            .fn()
            .mockReturnValue({ exec: execFunc }) as MockFnWithExec,
        });

        await expect(service.findById(nonExistentId)).rejects.toThrow(
          AnimalException,
        );

        expect(mockCatModel.findById).toHaveBeenCalledWith(nonExistentId);
        expect(execFunc).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('findByUser', () => {
    describe('existent user id', () => {
      it('must return cats of user', async () => {
        const userId = '694ac1f93b5320db21a572a5';
        const cats: CatResponse[] = mockCatsList(5);
        const catType = 'cat';
        const mockCatsWithType = cats.map((obj) => {
          obj.owner = userId;
          return {
            ...obj,
            type: catType,
          };
        });

        mockCatModel.where = jest.fn().mockReturnValue({
          equals: jest.fn().mockResolvedValue(
            cats.map((cat) => ({
              toJSON: () => cat,
            })),
          ),
        }) as MockFnWhereEquals;

        const result = await service.findByUser(userId);

        expect(mockCatModel.where).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockCatsWithType);
      });
    });

    describe('nonexistent user id', () => {
      it('must return empty array', async () => {
        const nonExistentId = '999999999999999999999999';
        const cats: CatResponse[] = [];

        mockCatModel.where = jest.fn().mockReturnValue({
          equals: jest.fn().mockResolvedValue(cats),
        }) as MockFnWhereEquals;

        const result = await service.findByUser(nonExistentId);

        expect(mockCatModel.where).toHaveBeenCalledTimes(1);
        expect(result).toEqual(cats);
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
          age: 13,
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
