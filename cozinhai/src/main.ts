import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
    BadRequestException,
    ValidationError,
    ValidationPipe,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

    // Configuração do Swagger
    const config = new DocumentBuilder()
        .setTitle('Cozinhai - Backend API')
        .setDescription(
            'Esta API fornece os serviços de backend para uma plataforma voltada à redução do desperdício de alimentos. Ela é responsável pelo gerenciamento de usuários (incluindo autenticação opcional), além de permitir que usuários autenticados possam favoritar receitas, comentar e avaliá-las. Comentários e avaliações podem ser visualizados por qualquer usuário, autenticado ou não. A API não realiza integração direta com serviços externos de receitas, mas oferece suporte às funcionalidades sociais e personalizadas da aplicação.',
        )
        .setVersion('0.1.0')
        .addTag('Usuarios', 'Endpoints relacionados a usuários')
        .addTag('Receitas', 'Endpoints relacionados a receitas')
        .addTag('Avaliações', 'Endpoints relacionados a avaliações de receitas')
        .setContact(
            'Robson Alan Mantovani',
            'https://github.com/robson817',
            'robsonamantovani@gmail.com',
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
