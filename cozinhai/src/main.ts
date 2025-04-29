import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
    BadRequestException,
    ValidationError,
    ValidationPipe,
} from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    //app.enableCors(); Poderemos adicionar os parâmetros para não dar problema de cors ou usar o Nginx na infra para resolver isso

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true, // transforma os dados de entrada para o tipo correto
            whitelist: true, // remove campos que não estão no DTO
            forbidNonWhitelisted: true, // retorna erro se tiver campos que não estão no DTO
            exceptionFactory: (validationErrors: ValidationError[]) => {
                const errors: Record<string, string[]> = {};
                validationErrors.forEach((error) => {
                    errors[error.property] = Object.values(
                        error.constraints ?? {},
                    );
                });
                return new BadRequestException({
                    statusCode: 400,
                    errors: errors,
                });
            },
        }),
    );

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
