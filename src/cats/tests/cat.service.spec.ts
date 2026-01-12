import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CatService } from '../services/cat.service';
import { AnimalDTO } from 'src/animal/dto/animal.dto';

describe('CatService', () => {
  let service: CatService;

  interface MockModel extends jest.Mock {
    find: jest.Mock<any, any, any>;
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
      const catDTO = {
        name: 'Bars',
        age: 3,
        litterStatus: 'trained',
      } as AnimalDTO;

      const savedCat = {
        _id: '507f1f77bcf86cd799439011',
        ...catDTO,
      };

      const saveMock = jest.fn().mockResolvedValue(savedCat);

      mockCatModel.mockImplementation(() => {
        return {
          save: saveMock,
        };
      });

      const result = await service.create(catDTO);

      expect(result).toEqual(savedCat);
      expect(mockCatModel).toHaveBeenCalledTimes(1);
      expect(mockCatModel).toHaveBeenLastCalledWith(catDTO);
      expect(saveMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('return all cats', async () => {
      const mockCats = [
        {
          _id: '694ac1f93b5320db21a572a5',
          name: 'Bars',
          age: 3,
          litterStatus: 'trained',
        },
        {
          _id: '694ac1f93b5320db21a572a5',
          name: 'Mura',
          age: 1,
          litterStatus: 'trained',
        },
      ];

      mockCatModel.find = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCats),
      });
      const result = await service.findAll();
      expect(mockCatModel.find().exec).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCats);
    });
  });
});
