import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Recipe, RecipeDocument } from './recipe.schema';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/users.schema';

@Injectable()
export class RecipesService {
    constructor(
        @InjectModel(Recipe.name)
        private readonly recipeModel: Model<RecipeDocument>,
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
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

        const activeReviews = [];

        for (const review of recipe.reviews) {
            const user = await this.userModel
                .findById(review.userId)
                .select('status');
            if (user?.status) {
                activeReviews.push({
                    date: review.date,
                    comment: review.comment ?? '',
                    grade: review.grade,
                    userId: review.userId,
                });
            }
        }

        return activeReviews.slice(offset, offset + limit);
    }
}
