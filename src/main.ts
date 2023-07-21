import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnhandledErrorsFilter } from './domain/filters/unhandled-errors.filter';
import { SeedersService } from './seeders/seeders.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // Create Nest application instance
  const app = await NestFactory.create(AppModule);

  // Retrieve registered services from app
  const configService = app.get<ConfigService>(ConfigService);
  const seedersService = app.get<SeedersService>(SeedersService);

  // If env is 'development' seed database
  if (configService.get('environment') === 'development') {
    seedersService.seedDatabase();
  }

  // Apply ValidationPipe globally for DTOs validation
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[]) => {
        const errorsMessages = validationErrors.map(
          ({ constraints }) => Object.values(constraints)[0],
        );
        return new BadRequestException(errorsMessages[0]);
      },
    }),
  );

  // Apply Exception filters globally to transform unhandled Business errors into HTTP exceptions
  app.useGlobalFilters(new UnhandledErrorsFilter());

  // Start web server
  await app.listen(3000);
}
bootstrap();
