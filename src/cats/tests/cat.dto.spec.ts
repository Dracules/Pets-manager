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
});
