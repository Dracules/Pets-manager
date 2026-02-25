import { CatDTO } from '../../../cats/dto/cat.dto';
import { CatResponse } from '../../../cats/interfaces/cat.interface';

export const mockCatDTO = (overrides: Partial<CatDTO> = {}): CatDTO => ({
  name: 'Bars',
  age: 3,
  litterStatus: 'unknown',
  ...overrides,
});

export const mockCatDTOList = (count = 5): CatDTO[] =>
  Array.from({ length: count }, (_, i) =>
    mockCatDTO({ name: `Bars${i.toString()}` }),
  );

export const mockCat = (overrides: Partial<CatResponse> = {}): CatResponse => ({
  id: '1',
  name: 'Bars',
  age: 3,
  litterStatus: 'unknown',
  owner: '111',
  ...overrides,
});

export const mockCatsList = (count = 5): CatResponse[] =>
  Array.from({ length: count }, (_, i) => mockCat({ id: i.toString() }));
