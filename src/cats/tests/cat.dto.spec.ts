import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CatDTO } from '../dto/cat.dto';

describe('CatDto', () => {
  it('valid catDTO', async () => {
    const validCatDTO: CatDTO = plainToInstance(CatDTO, {
      litterStatus: 'not trained',
      name: 'Bars',
      age: 3,
    });

    const errors = await validate(validCatDTO);
    console.log(errors);
    expect(errors.length).toBe(0);
  });

  it('catDTO without LitterStatus', async () => {
    const catDTOWithoutLitterStatus: Partial<CatDTO> = plainToInstance(CatDTO, {
      name: 'Bars',
      age: 3,
    });

    const errors = await validate(catDTOWithoutLitterStatus);
    console.log(catDTOWithoutLitterStatus);
    expect(errors.length).toBe(0);
  });

  it('catDTO with invalid LitterStatus', async () => {
    const catDTOWithoutLitterStatus: CatDTO = plainToInstance(CatDTO, {
      name: 'Bars',
      age: 3,
      litterStatus: 'innocent',
    });

    const errors = await validate(catDTOWithoutLitterStatus);
    console.log(catDTOWithoutLitterStatus);
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
    const catDTOWithShortName: CatDTO = plainToInstance(CatDTO, {
      name: 'F',
      age: 3,
      litterStatus: 'trained',
    });

    const errors = await validate(catDTOWithShortName);
    expect(errors.length).toBe(1);
  });

  it('catDTO with short (>=2 symbols) name', async () => {
    const catDTOWithLongName: CatDTO = plainToInstance(CatDTO, {
      name: 'Om',
      age: 3,
      litterStatus: 'trained',
    });

    const errors = await validate(catDTOWithLongName);
    expect(errors.length).toBe(0);
  });

  it('catDTO with negative age', async () => {
    const catDTOWithNegativeAge: CatDTO = plainToInstance(CatDTO, {
      name: 'Om',
      age: -1,
      litterStatus: 'trained',
    });

    const errors = await validate(catDTOWithNegativeAge);
    expect(errors.length).toBe(1);
  });

  it('catDTO with zero age', async () => {
    const catDTOWithZeroAge: CatDTO = plainToInstance(CatDTO, {
      name: 'Om',
      age: 0,
      litterStatus: 'trained',
    });

    const errors = await validate(catDTOWithZeroAge);
    expect(errors.length).toBe(0);
  });

  it('catDTO with fractional age', async () => {
    const catDTOWithFractionalAge: CatDTO = plainToInstance(CatDTO, {
      name: 'Om',
      age: 0.1,
      litterStatus: 'trained',
    });

    const errors = await validate(catDTOWithFractionalAge);
    expect(errors.length).toBe(1);
  });
});
