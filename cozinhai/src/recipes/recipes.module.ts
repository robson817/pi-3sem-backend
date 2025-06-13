import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { Recipe, RecipesSchema } from './recipe.schema';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Recipe.name, schema: RecipesSchema },
        ]),
        forwardRef(() => UsersModule), // 👈 aqui
    ],
    controllers: [RecipesController],
    providers: [RecipesService],
    exports: [MongooseModule],
})
export class RecipesModule {}
