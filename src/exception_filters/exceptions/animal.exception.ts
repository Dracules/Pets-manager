import { HttpException, HttpStatus } from '@nestjs/common';

export class AnimalException extends HttpException {
  constructor() {
    super('Animal is not found. Check id.', HttpStatus.NOT_FOUND);
  }
}
