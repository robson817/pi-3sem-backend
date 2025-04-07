import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

import mongoose from 'mongoose';

mongoose.connection.on('connected', () => {
    console.log('✅ Conectado ao MongoDB com sucesso!');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Erro na conexão com o MongoDB:', err);
});
