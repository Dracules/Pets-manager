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
});
