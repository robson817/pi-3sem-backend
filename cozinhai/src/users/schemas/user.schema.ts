import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({ required: true })
    name!: string;

    @Prop({ required: true, unique: true })
    email!: string;

    @Prop({ required: true })
    passwordHash!: string;

    @Prop({
        type: [
            {
                recipeId: String,
                title: String,
            },
        ],
        default: [],
    })
    favoriteRecipes!: {
        recipeId: string;
        title: string;
    }[];

    @Prop({
        type: [
            {
                recipeId: String,
                date: Date,
                comment: String,
                grade: Number,
            },
        ],
        default: [],
    })
    reviewRecipes!: {
        recipeId: string;
        date: Date;
        comment: string;
        grade: number;
    }[];

    @Prop({ required: true, default: true })
    status!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
