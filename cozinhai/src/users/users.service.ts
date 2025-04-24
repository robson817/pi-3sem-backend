import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Recipe, RecipeDocument } from 'src/recipes/recipe.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateNameDto } from './dto/update/update-name.dto';
import { UpdatePasswordDto } from './dto/update/update-password.dto';
import { CreateFavoritesDto } from './dto/create/create-favorites.dto';
import { DeleteFavoritesDto } from './dto/delete/delete-favorites.dto';
import { CreateReviewDto } from './dto/create/create-review.dto';
import { UpdateReviewDto } from './dto/update/update-review.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name, Recipe.name)
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

        // Verifica se a senha atual fornecida é válida
        const isPasswordValid = await bcrypt.compare(
            updatePasswordDto.currentPassword,
            user.passwordHash,
        );
        if (!isPasswordValid) {
            throw new BadRequestException('Senha atual incorreta');
        }

        const salt = user.email + '$';

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

    async removeFavoriteRecipe(
        userId: string,
        deleteFavoritesDto: DeleteFavoritesDto,
    ): Promise<User> {
        const updatedUser = await this.userModel.findByIdAndUpdate(
            userId,
            {
                $pull: {
                    favoriteRecipes: { recipeId: deleteFavoritesDto.id },
                },
            },
            { new: true }, // retorna o documento atualizado
        );

        if (!updatedUser) {
            throw new NotFoundException('Usuário não encontrado');
        }

        // Verifica se realmente havia esse favorito
        const stillExists = updatedUser.favoriteRecipes.some(
            (fav) => fav.recipeId === deleteFavoritesDto.id,
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
        createReviewDto: CreateReviewDto,
        updateReviewDto: UpdateReviewDto,
    ): Promise<{ user: User; recipe: Recipe }> {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        const recipe = await this.recipeModel.findById(createReviewDto.id);
        if (!recipe) {
            throw new NotFoundException('Receita não encontrada');
        }

        const existingReview = user.reviewRecipes.find(
            (review) => review.recipeId === createReviewDto.id,
        );

        const reviewData = {
            userId,
            recipeId: createReviewDto.id,
            title: createReviewDto.title,
            date: new Date(),
            comment: existingReview
                ? (updateReviewDto.comment ?? existingReview.comment)
                : createReviewDto.comment,
            grade: existingReview
                ? (updateReviewDto.grade ?? existingReview.grade)
                : createReviewDto.grade,
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
    ): Promise<{ recipeId: string; title: string }[]> {
        const user = await this.userModel.findById(userId);

        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }
        return user.favoriteRecipes.slice(0, 10); //corrigir  futuramente para fazer paginação
    }

    async listUserReviews(userId: string): Promise<User['reviewRecipes']> {
        const user = await this.userModel.findById(userId);

        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        // Ordena por data (mais recente primeiro)
        const orderedReviews = user.reviewRecipes.sort(
            (a, b) => b.date.getTime() - a.date.getTime(),
        );

        return orderedReviews.slice(0, 10); //corrigir  futuramente para fazer paginação
    }

    async listRecipeReviews(
        recipeId: string,
    ): Promise<{ date: Date; comment: string; grade: number }[]> {
        const recipe = await this.recipeModel.findById(recipeId);

        if (!recipe) {
            throw new NotFoundException('Receita não encontrada');
        }

        // Retorna apenas os reviews com as propriedades solicitadas
        return recipe.reviews
            .map((review) => ({
                date: review.date,
                comment: review.comment ?? '', // Talvez seria mais performático inicializar o comentário como string vazia e pular esse map
                grade: review.grade,
            }))
            .slice(0, 10);
    }
}
