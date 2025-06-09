import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
    BadRequestException,
    ValidationError,
    ValidationPipe,
} from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Configuração do CORS, permitindo origem específica para maior segurança
    app.enableCors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Permitir CORS apenas para domínios específicos
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Authorization',
    });

    // Validação de entrada global com customização de erro
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true, // Transforma os dados de entrada no tipo correto
            whitelist: true, // Remove campos que não estão no DTO
            forbidNonWhitelisted: true, // Retorna erro se houver campos extras
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
