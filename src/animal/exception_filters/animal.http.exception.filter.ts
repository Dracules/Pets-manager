import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { AnimalException } from './exceptions/animal.exception';

@Catch(AnimalException)
export class AnimalExceptionFilter implements ExceptionFilter {
  catch(exception: AnimalException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      message: exception.getResponse(),
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
