import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Recipe, RecipeDocument } from 'src/recipes/recipe.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateNameDto } from './dto/update/update-name.dto';
import { UpdatePasswordDto } from './dto/update/update-password.dto';
import { CreateFavoritesDto } from './dto/create/create-favorites.dto';
import { CreateReviewDto } from './dto/create/create-review.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>, // Pode ser usado 'User' no lugar do User.name
        @InjectModel(Recipe.name)
        private recipeModel: Model<RecipeDocument>,
    ) {}

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        //Verifica se o email já existe no banco
        const existingEmail = await this.userModel.findOne({
            email: createUserDto.email,
        });
        if (existingEmail) {
            throw new BadRequestException('Email já está em uso');
        }
        const salt = createUserDto.email + '$';
        // Cria a variável password e a userData será todo o Dto, menos o password
        const { password, ...userData } = createUserDto;
        // Hash da senha
        const hashedPassword: string = await bcrypt.hash(salt + password, 10);

        //Poderia ser feito assim
        // const name = createUserDto.name;
        // const email = createUserDto.email;

        // Cria usuário com a senha já criptografada
        const createdUser = new this.userModel({
            ...userData,
            passwordHash: hashedPassword,
        });

        return createdUser.save();
    }

    async updateName(
        userId: string,
        updateNameDto: UpdateNameDto,
    ): Promise<User> {
        const user = await this.userModel.findByIdAndUpdate(
            userId,
            { name: updateNameDto.name },
            { new: true }, //retorna o novo nome no post do thunder client
        );

        if (!user) throw new NotFoundException('Usuário não encontrado');
        return user;
    }

    async updatePassword(
        userId: string,
        updatePasswordDto: UpdatePasswordDto,
    ): Promise<User> {
        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException('Usuário não encontrado');

        const salt = user.email + '$';

        // Verifica se a senha atual fornecida é válida
        const isPasswordValid = await bcrypt.compare(
            salt + updatePasswordDto.currentPassword,
            user.passwordHash,
        );
        if (!isPasswordValid) {
            throw new BadRequestException('Senha atual incorreta');
        }

        // Faz o hash da nova senha antes de salvar
        const hashedPassword = await bcrypt.hash(
            salt + updatePasswordDto.newPassword,
            10,
        );
        user.passwordHash = hashedPassword;

        return user.save();
    }

    async addFavoriteRecipe(
        userId: string,
        createFavoritesDto: CreateFavoritesDto,
    ): Promise<User> {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        const recipeAlreadyExists = user.favoriteRecipes.some(
            (fav) => fav.recipeId === createFavoritesDto.id,
        );
        if (recipeAlreadyExists) {
            throw new BadRequestException('Receita já está nos favoritos');
        }
        user.favoriteRecipes.unshift({
            recipeId: createFavoritesDto.id,
            title: createFavoritesDto.title,
        });
        return user.save();
    }

    // Não é necessário DTO para deletar
    async removeFavoriteRecipe(
        userId: string,
        recipeId: string,
    ): Promise<User> {
        const updatedUser = await this.userModel.findByIdAndUpdate(
            userId,
            {
                $pull: {
                    favoriteRecipes: { recipeId },
                },
            },
            { new: true }, // retorna o documento atualizado
        );

        if (!updatedUser) {
            throw new NotFoundException('Usuário não encontrado');
        }

        // Verifica se realmente havia esse favorito
        const stillExists = updatedUser.favoriteRecipes.some(
            (fav) => fav.recipeId === recipeId,
        );
        if (stillExists) {
            throw new BadRequestException('Falha ao remover favorito');
        }
        return updatedUser;
    }

    // async removeFavoriteRecipe(
    //     userId: string,
    //     deleteFavoritesDto: DeleteFavoritesDto,
    // ): Promise<User> {
    //     const user = await this.userModel.findById(userId);
    //     if (!user) {
    //         throw new NotFoundException('Usuário não encontrado');
    //     }

    //     const alreadyFavoriteRecipe = user.favoriteRecipes.some(
    //         (fav) => fav.recipeId === deleteFavoritesDto.id,
    //     );

    //     if (!alreadyFavoriteRecipe) {
    //         throw new BadRequestException('Receita não está nos favoritos');
    //     }

    //     user.favoriteRecipes = user.favoriteRecipes.filter(
    //         (fav) => fav.recipeId !== deleteFavoritesDto.id,
    //     );
    //     return user.save();
    // }

    async addReview(
        userId: string,
        recipeId: string,
        createReviewDto: CreateReviewDto,
    ): Promise<{ user: User; recipe: Recipe }> {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        let recipe = await this.recipeModel.findById({ recipeId });

        if (!recipe) {
            recipe = new this.recipeModel({
                recipeId,
                title: createReviewDto.title ?? 'Receita sem título',
                reviews: [],
            });
        }

        const existingReview = user.reviewRecipes.find(
            (review) => review.recipeId === recipeId,
        );

        if (
            !existingReview &&
            (createReviewDto.grade === null ||
                createReviewDto.grade === undefined)
        ) {
            throw new BadRequestException(
                'A nota é obrigatória para criar um review',
            );
        }

        const finalGrade = createReviewDto.grade ?? existingReview?.grade;
        if (finalGrade === undefined || finalGrade === null) {
            throw new BadRequestException('Nota inválida');
        }

        const reviewData = {
            userId,
            recipeId,
            title: createReviewDto.title ?? existingReview?.title ?? '',
            date: new Date(),
            comment: createReviewDto.comment ?? existingReview?.comment ?? '',
            grade: finalGrade,
        };

        // Atualiza ou adiciona review no usuário
        if (existingReview) {
            user.reviewRecipes = user.reviewRecipes.map((review) =>
                review.recipeId === reviewData.recipeId ? reviewData : review,
            );
        } else {
            user.reviewRecipes.push(reviewData);
        }

        // Atualiza ou adiciona review na receita
        const reviewIndex = recipe.reviews.findIndex(
            (review) => review.userId === userId,
        );

        if (reviewIndex !== -1) {
            recipe.reviews[reviewIndex] = reviewData;
        } else {
            recipe.reviews.push(reviewData);
        }
        await user.save();
        await recipe.save();

        return { user, recipe };
    }

    async listFavoriteRecipes(
        userId: string,
        limit: number,
        offset: number,
    ): Promise<{ recipeId: string; title: string }[]> {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }
        return user.favoriteRecipes.slice(offset, offset + limit);
    }

    async listUserReviews(
        userId: string,
        limit: number,
        offset: number,
    ): Promise<User['reviewRecipes']> {
        const user = await this.userModel.findById(userId);

        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        // Ordena por data (mais recente primeiro)
        const orderedReviews = user.reviewRecipes.sort(
            (a, b) => b.date.getTime() - a.date.getTime(),
        );

        return orderedReviews.slice(offset, offset + limit);
    }

    async listRecipeReviews(
        recipeId: string,
        limit: number,
        offset: number,
    ): Promise<{ date: Date; comment: string; grade: number }[]> {
        const recipe = await this.recipeModel.findById(recipeId);

        if (!recipe) {
            throw new NotFoundException('Receita não encontrada');
        }

        // Retorna apenas os reviews com as propriedades solicitadas
        return recipe.reviews.slice(offset, offset + limit).map((review) => ({
            date: review.date,
            comment: review.comment ?? '',
            grade: review.grade,
        }));
    }
}
