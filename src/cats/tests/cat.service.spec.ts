import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CatService } from '../services/cat.service';
import { AnimalDTO } from 'src/animal/dto/animal.dto';

describe('CatService', () => {
  let service: CatService;

  interface MockModel extends jest.Mock {}

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
});
