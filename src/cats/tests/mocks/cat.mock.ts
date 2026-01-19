import { CatDTO } from 'src/cats/dto/cat.dto';

export const mockCatDTO = (overrides: Partial<CatDTO> = {}): CatDTO => ({
  name: 'Bars',
  age: 3,
  litterStatus: 'unknown',
  ...overrides,
});
