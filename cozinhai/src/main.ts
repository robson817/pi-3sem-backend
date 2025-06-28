import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
    BadRequestException,
    ValidationError,
    ValidationPipe,
} from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: process.env.CORS_ORIGIN || '0.0.0.0',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Authorization',
    });

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            exceptionFactory: (validationErrors: ValidationError[]) => {
                const errors: Record<string, string[]> = {};
                validationErrors.forEach((error) => {
                    errors[error.property] = Object.values(
                        error.constraints ?? {},
                    );
                });
                return new BadRequestException({
                    statusCode: 400,
                    message: 'Validação falhou',
                    errors: errors,
                });
            },
        }),
    );

    await app.listen(process.env.PORT || 3001);
}

bootstrap();
