import { CatDTO } from '../../dto/cat.dto';
import type { CatResponse } from '../../interfaces/cat.interface';

export const mockCatDTO = (overrides: Partial<CatDTO> = {}): CatDTO => ({
  name: 'Bars',
  birthDate: new Date(),
  litterStatus: 'unknown',
  ...overrides,
});

export const mockCatDTOList = (count = 5): CatDTO[] =>
  Array.from({ length: count }, (_, i) =>
    mockCatDTO({ name: `Bars${i.toString()}` }),
  );

export const mockCat = (overrides: Partial<CatResponse> = {}): CatResponse => ({
  _id: '1',
  name: 'Bars',
  birthDate: new Date(),
  age: '0 years 0 months',
  litterStatus: 'unknown',
  owner: { _id: '111', login: 'user' },
  ...overrides,
});

export const mockCatsList = (count = 5): CatResponse[] =>
  Array.from({ length: count }, (_, i) => mockCat({ _id: i.toString() }));
