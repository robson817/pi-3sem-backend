import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { RecipesModule } from './recipes/recipes.module';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost/nome-do-banco'),
        UsersModule,
        RecipesModule,
    ], //colocar a string de conexão
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
