import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CatService } from '../services/cat.service';
import { AnimalException } from '../../animal/exception_filters/exceptions/animal.exception';
import { mockCat, mockCatsList } from './mocks/cat.mock';
import { Cat } from '../interfaces/cat.interface';

describe('CatService', () => {
  let service: CatService;

  interface MockModel extends jest.Mock {
    find: jest.Mock<any, any, any>;
    findById: jest.Mock<any, any, any>;
    findByIdAndUpdate: jest.Mock<any, any, any>;
    findByIdAndDelete: jest.Mock<any, any, any>;
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
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('create new cat', async () => {
      const cat = mockCat();

      const savedCat = {
        _id: '507f1f77bcf86cd799439011',
        ...cat,
      };

      const saveMock = jest.fn().mockResolvedValue(savedCat);

      mockCatModel.mockImplementation(() => {
        return {
          save: saveMock,
        };
      });

      const result = await service.create(cat);

      expect(result).toEqual(savedCat);
      expect(mockCatModel).toHaveBeenCalledTimes(1);
      expect(mockCatModel).toHaveBeenLastCalledWith(cat);
      expect(saveMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('return all cats', async () => {
      const mockCats = mockCatsList();

      mockCatModel.find = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCats),
      });

      const result = await service.findAll();
      expect(mockCatModel.find().exec).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCats);
    });
  });

  describe('findById', () => {
    describe('existent id', () => {
      it('must return cat with ID', async () => {
        const catId = '694ac1f93b5320db21a572a5';
        const cat = mockCat({ id: catId });

        mockCatModel.findById = jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(cat),
        });

        const result = await service.findById(catId);

        expect(mockCatModel.findById).toHaveBeenCalledWith(catId);
        expect(mockCatModel.findById().exec).toHaveBeenCalledTimes(1);
        expect(result).toEqual(cat);
      });
    });

    describe('nonexistent id', () => {
      it('must throw AnimalException', async () => {
        const nonExistentId = '999999999999999999999999';

        mockCatModel.findById = jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        });

        await expect(service.findById(nonExistentId)).rejects.toThrow(
          AnimalException,
        );

        expect(mockCatModel.findById).toHaveBeenCalledWith(nonExistentId);
        expect(mockCatModel.findById().exec).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('updateById', () => {
    describe('existent id', () => {
      it('must return cat with ID and new data', async () => {
        const catId = '694ac1f93b5320db21a572a5';

        const newData: Partial<Cat> = {
          name: 'Bart',
          age: 13,
        };

        const updatedCat = mockCat(newData);

        mockCatModel.findByIdAndUpdate = jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(updatedCat),
        });

        const result = await service.updateById(catId, newData);

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

    describe('nonexistent id', () => {
      it('must throw AnimalException', async () => {
        const nonExistentId = '999999999999999999999999';

        const newData: Partial<Cat> = {};

        mockCatModel.findByIdAndUpdate = jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        });

        await expect(
          service.updateById(nonExistentId, newData),
        ).rejects.toThrow(AnimalException);

        expect(mockCatModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
        expect(mockCatModel.findByIdAndUpdate).toHaveBeenCalledWith(
          nonExistentId,
          newData,
          { new: true, runValidators: true },
        );
        expect(mockCatModel.findByIdAndUpdate().exec).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('delete', () => {
    describe('existent id', () => {
      it('must delete cat with ID and return hardcoded string', async () => {
        const catId = '694ac1f93b5320db21a572a5';

        const deletedCat = mockCat({ id: catId });

        const expectedResponse = 'Selected item is deleted successfully!';

        mockCatModel.findByIdAndDelete = jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(deletedCat),
        });

        const result = await service.delete(catId);

        expect(mockCatModel.findByIdAndDelete).toHaveBeenCalledTimes(1);
        expect(mockCatModel.findByIdAndDelete).toHaveBeenCalledWith(catId);
        expect(mockCatModel.findByIdAndDelete().exec).toHaveBeenCalledTimes(1);
        expect(result).toEqual(expectedResponse);
      });
    });

    describe('nonexistent id', () => {
      it('must throw AnimalException', async () => {
        const nonExistentId = '999999999999999999999999';

        mockCatModel.findByIdAndDelete = jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        });

        await expect(service.delete(nonExistentId)).rejects.toThrow(
          AnimalException,
        );

        expect(mockCatModel.findByIdAndDelete).toHaveBeenCalledTimes(1);
        expect(mockCatModel.findByIdAndDelete).toHaveBeenCalledWith(
          nonExistentId,
        );
        expect(mockCatModel.findByIdAndDelete().exec).toHaveBeenCalledTimes(1);
      });
    });
  });
});
