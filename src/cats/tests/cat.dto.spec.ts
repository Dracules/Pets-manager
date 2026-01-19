import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CatDTO } from '../dto/cat.dto';
import { mockCatDTO } from './mocks/cat.mock';

describe('CatDto', () => {
  it('valid catDTO', async () => {
    const validCatDTO: CatDTO = plainToInstance(CatDTO, mockCatDTO());

    const errors = await validate(validCatDTO);
    expect(errors.length).toBe(0);
  });

  describe('catDTO with every LitterStatus', () => {
    it('with LitterStatus = unknown', async () => {
      const validCatDTO: CatDTO = plainToInstance(
        CatDTO,
        mockCatDTO({ litterStatus: 'unknown' }),
      );

      const errors = await validate(validCatDTO);
      expect(errors.length).toBe(0);
    });

    it('with LitterStatus = not trained', async () => {
      const validCatDTO: CatDTO = plainToInstance(
        CatDTO,
        mockCatDTO({ litterStatus: 'not trained' }),
      );

      const errors = await validate(validCatDTO);
      expect(errors.length).toBe(0);
    });

    it('with LitterStatus = trained', async () => {
      const validCatDTO: CatDTO = plainToInstance(
        CatDTO,
        mockCatDTO({ litterStatus: 'trained' }),
      );

      const errors = await validate(validCatDTO);
      expect(errors.length).toBe(0);
    });
  });

  it('catDTO without LitterStatus', async () => {
    const catDTOWithoutLitterStatus: Partial<CatDTO> = plainToInstance(CatDTO, {
      name: 'Bars',
      age: 3,
    });

    const errors = await validate(catDTOWithoutLitterStatus);
    expect(errors.length).toBe(0);
  });

  it('catDTO with invalid LitterStatus', async () => {
    const catDTOWithoutLitterStatus: CatDTO = plainToInstance(CatDTO, {
      name: 'Bars',
      age: 3,
      litterStatus: 'innocent',
    });

    const errors = await validate(catDTOWithoutLitterStatus);
    expect(errors.length).toBe(1);
  });

  it('catDTO without name', async () => {
    const catDTOWithoutName: CatDTO = plainToInstance(CatDTO, {
      age: 3,
      litterStatus: 'not trained',
    });

    const errors = await validate(catDTOWithoutName);
    expect(errors.length).toBe(1);
  });

  it('catDTO without age', async () => {
    const catDTOWithoutAge: CatDTO = plainToInstance(CatDTO, {
      name: 'Bars',
      litterStatus: 'trained',
    });

    const errors = await validate(catDTOWithoutAge);
    expect(errors.length).toBe(1);
  });

  it('catDTO with short (<2 symbols) name', async () => {
    const catDTOWithShortName: CatDTO = plainToInstance(
      CatDTO,
      mockCatDTO({ name: 'F' }),
    );

    const errors = await validate(catDTOWithShortName);
    expect(errors.length).toBe(1);
  });

  it('catDTO with short (>=2 symbols) name', async () => {
    const catDTOWithLongName: CatDTO = plainToInstance(
      CatDTO,
      mockCatDTO({ name: 'Oz' }),
    );

    const errors = await validate(catDTOWithLongName);
    expect(errors.length).toBe(0);
  });

  it('catDTO with negative age', async () => {
    const catDTOWithNegativeAge: CatDTO = plainToInstance(
      CatDTO,
      mockCatDTO({ age: -1 }),
    );

    const errors = await validate(catDTOWithNegativeAge);
    expect(errors.length).toBe(1);
  });

  it('catDTO with zero age', async () => {
    const catDTOWithZeroAge: CatDTO = plainToInstance(
      CatDTO,
      mockCatDTO({ age: 0 }),
    );

    const errors = await validate(catDTOWithZeroAge);
    expect(errors.length).toBe(0);
  });

  it('catDTO with fractional age', async () => {
    const catDTOWithFractionalAge: CatDTO = plainToInstance(
      CatDTO,
      mockCatDTO({ age: 0.1 }),
    );

    const errors = await validate(catDTOWithFractionalAge);
    expect(errors.length).toBe(1);
  });
});
