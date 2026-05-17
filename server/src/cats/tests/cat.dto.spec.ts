import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CatDTO } from '../dto/cat.dto';
import { mockCatDTO } from './mocks/cat.mock';
import { addMonths, subMonths, addYears, subYears, addDays } from 'date-fns';

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
    const catDTOWithoutLitterStatus: CatDTO = plainToInstance(CatDTO, {
      name: 'Bars',
      birthDate: new Date(),
    });

    const errors = await validate(catDTOWithoutLitterStatus);
    expect(errors.length).toBe(0);
  });

  it('catDTO with invalid LitterStatus', async () => {
    const catDTOWithoutLitterStatus: CatDTO = plainToInstance(CatDTO, {
      name: 'Bars',
      birthDate: new Date(),
      litterStatus: 'innocent',
    });

    const errors = await validate(catDTOWithoutLitterStatus);
    expect(errors.length).toBe(1);
  });

  it('catDTO without name', async () => {
    const catDTOWithoutName: CatDTO = plainToInstance(CatDTO, {
      birthDate: new Date(),
      litterStatus: 'not trained',
    });

    const errors = await validate(catDTOWithoutName);
    expect(errors.length).toBe(1);
  });

  it('catDTO without birthDate', async () => {
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

  it('catDTO with valid date', async () => {
    const catDTOWithValidDate: CatDTO = plainToInstance(
      CatDTO,
      mockCatDTO({ birthDate: new Date('2020-01-15') }),
    );

    const errors = await validate(catDTOWithValidDate);
    expect(errors.length).toBe(0);
  });

  it('catDTO with max date (today)', async () => {
    const catDTOWithMaxDate: CatDTO = plainToInstance(
      CatDTO,
      mockCatDTO({ birthDate: new Date() }),
    );

    const errors = await validate(catDTOWithMaxDate);
    expect(errors.length).toBe(0);
  });

  it('catDTO with min date (40 years ago)', async () => {
    const minBound = addDays(subYears(new Date(), 40), 1);
    const catDTOWithMinDate: CatDTO = plainToInstance(
      CatDTO,
      mockCatDTO({ birthDate: minBound }),
    );

    const errors = await validate(catDTOWithMinDate);
    expect(errors.length).toBe(0);
  });

  it('catDTO with incorrect date (older than 40 years)', async () => {
    const oldDate = subMonths(subYears(new Date(), 40), 1);
    const catDTOWithOldDate: CatDTO = plainToInstance(
      CatDTO,
      mockCatDTO({ birthDate: oldDate }),
    );

    const errors = await validate(catDTOWithOldDate);
    expect(errors.length).toBe(1);
  });

  it('catDTO with incorrect date (futureDate)', async () => {
    const futureDate = addMonths(new Date(), 1);
    const catDTOWithFutureDate: CatDTO = plainToInstance(
      CatDTO,
      mockCatDTO({ birthDate: futureDate }),
    );

    const errors = await validate(catDTOWithFutureDate);
    expect(errors.length).toBe(1);
  });

  it('catDTO with valid string date', async () => {
    const catDTOWithFutureDate: CatDTO = plainToInstance(CatDTO, {
      name: 'Bars',
      birthDate: '2025-01-15',
      litterStatus: 'trained',
    });

    const errors = await validate(catDTOWithFutureDate);
    expect(errors.length).toBe(0);
  });

  it('catDTO with invalid date string', async () => {
    const catDTOWithFutureDate: CatDTO = plainToInstance(CatDTO, {
      name: 'Bars',
      birthDate: 'not-a-date',
      litterStatus: 'trained',
    });

    const errors = await validate(catDTOWithFutureDate);
    expect(errors.length).toBe(1);
  });

  /*
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
  });*/
});
