import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CatService } from '../services/cat.service';

describe('CatService', () => {
  let service: CatService;

  let mockCatModel: any;

  beforeAll(async () => {
    mockCatModel = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatService,
        { provide: getModelToken('Cat'), useValue: mockCatModel },
      ],
    }).compile();

    service = module.get<CatService>(CatService);
  });

  afterEach(() => jest.clearAllMocks());
});
