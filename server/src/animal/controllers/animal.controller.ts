import { Controller, Get } from '@nestjs/common';
import { Roles } from '../../shared/decorators/roles.decorator';

@Controller('animals')
export class AnimalController {
  constructor() {}

}
