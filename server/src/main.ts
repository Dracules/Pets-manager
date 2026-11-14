import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());

  const clientOrigin = process.env.CLIENT_URI || 'http://localhost:3001';
  app.enableCors({
    origin: [clientOrigin],
  });
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
