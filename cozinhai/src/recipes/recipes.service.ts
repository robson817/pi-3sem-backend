import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Recipe, RecipeDocument } from './recipe.schema';
import { Model } from 'mongoose';

@Injectable()
export class RecipesService {
    constructor(
        @InjectModel(Recipe.name)
        private readonly recipeModel: Model<RecipeDocument>,
    ) {}

    async listRecipeReviews(
        recipeId: string,
        limit: number,
        offset: number,
    ): Promise<{ date: Date; comment: string; grade: number }[]> {
        const recipe = await this.recipeModel.findOne({ recipeId });

        if (!recipe) {
            throw new NotFoundException('Receita não encontrada');
        }

        return recipe.reviews.slice(offset, offset + limit).map((review) => ({
            date: review.date,
            comment: review.comment ?? '',
            grade: review.grade,
        }));
    }
}
