import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RecipeDocument = HydratedDocument<Recipe>;

@Schema()
export class Recipe {
    @Prop({ required: true, unique: true })
    recipeId!: string;

    @Prop()
    title?: string;

    @Prop({
        type: [
            {
                userId: String,
                date: Date,
                comment: String,
                grade: Number,
            },
        ],
        default: [],
    })
    reviews!: {
        userId: string;
        date: Date;
        comment?: string;
        grade: number;
    }[];
}

export const RecipesSchema = SchemaFactory.createForClass(Recipe);
