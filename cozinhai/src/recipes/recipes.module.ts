import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { Recipe, RecipesSchema } from './recipe.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Recipe.name, schema: RecipesSchema },
        ]),
    ],
    controllers: [RecipesController],
    providers: [RecipesService],
    exports: [MongooseModule],
})
export class RecipesModule {}
