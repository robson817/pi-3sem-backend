import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name!: string;

    @Prop({
        required: true,
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Email inválido',
        ],
    })
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
                title: String,
                date: Date,
                comment: String,
                grade: {
                    type: Number,
                    min: 1,
                    max: 5,
                },
            },
        ],
        default: [],
    })
    reviewRecipes!: {
        recipeId: string;
        title: string;
        date: Date;
        comment?: string;
        grade: number;
    }[];

    @Prop({ required: true, default: true })
    status!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
