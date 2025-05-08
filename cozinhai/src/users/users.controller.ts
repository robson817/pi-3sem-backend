import {
    Controller,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    Get,
    Query,
    DefaultValuePipe,
    ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create/create-user.dto';
import { UpdateNameDto } from './dto/update/update-name.dto';
import { User } from './users.schema';
import { UpdatePasswordDto } from './dto/update/update-password.dto';
import { CreateFavoritesDto } from './dto/create/create-favorites.dto';
import { CreateReviewDto } from './dto/create/create-review.dto';
import { Recipe } from 'src/recipes/recipe.schema';

@Controller('users')
export class UsersController {
    constructor(private readonly UsersService: UsersService) {}

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return await this.UsersService.createUser(createUserDto);
    }

    @Patch(':id/name')
    async updateName(
        @Param('id') id: string,
        @Body() updateNameDto: UpdateNameDto,
    ): Promise<User> {
        return await this.UsersService.updateName(id, updateNameDto);
    }

    @Patch(':id/password')
    async updatePassword(
        @Param('id') id: string,
        @Body() updatePasswordDto: UpdatePasswordDto,
    ): Promise<User> {
        return await this.UsersService.updatePassword(id, updatePasswordDto);
    }

    @Patch(':id/favorites')
    async addFavoriteRecipe(
        @Param('id') id: string,
        @Body() createFavoritesDto: CreateFavoritesDto,
    ): Promise<User> {
        return await this.UsersService.addFavoriteRecipe(
            id,
            createFavoritesDto,
        );
    }

    @Delete(':id/favorites/:recipeId')
    async removeFavoriteRecipe(
        @Param('id') id: string,
        @Param('recipeId') recipeId: string,
    ): Promise<User> {
        return await this.UsersService.removeFavoriteRecipe(id, recipeId);
    }

    @Post('/:userId/:recipeId/reviews')
    async addReview(
        @Param('userId') userId: string,
        @Param('recipeId') recipeId: string,
        @Body() createReviewDto: CreateReviewDto,
    ): Promise<{ user: User; recipe: Recipe }> {
        return await this.UsersService.addReview(
            userId,
            recipeId,
            createReviewDto,
        );
    }

    @Get('/:id/favorites')
    async listFavoriteRecipes(
        @Param('id') id: string,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    ): Promise<{ recipeId: string; title: string }[]> {
        return await this.UsersService.listFavoriteRecipes(id, limit, offset);
    }

    @Get('/:id/reviews')
    async listUserReviews(
        @Param('id') id: string,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    ): Promise<{ recipeId: string; title: string }[]> {
        return await this.UsersService.listUserReviews(id, limit, offset);
    }

    @Get('/:recipeId/reviews')
    async listRecipeReviews(
        @Param('recipeId') recipeId: string,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    ): Promise<{ date: Date; comment: string; grade: number }[]> {
        return await this.UsersService.listRecipeReviews(
            recipeId,
            limit,
            offset,
        );
    }
}
