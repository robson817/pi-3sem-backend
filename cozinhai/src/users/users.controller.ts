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
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create/create-user.dto';
import { UpdateNameDto } from './dto/update/update-name.dto';
import { User } from './users.schema';
import { UpdatePasswordDto } from './dto/update/update-password.dto';
import { CreateFavoritesDto } from './dto/create/create-favorites.dto';
import { CreateReviewDto } from './dto/create/create-review.dto';
import { Recipe } from 'src/recipes/recipe.schema';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Usuário')
@ApiBearerAuth() // <-- Adicionado para exibir o botão "Authorize" no Swagger
@Controller('user')
export class UsersController {
    constructor(private readonly UsersService: UsersService) {}

    @Post()
    @ApiOperation({ summary: 'Cria um novo usuário' })
    async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
        const user = await this.UsersService.createUser(createUserDto);
        const userObj: Partial<User> = JSON.parse(
            JSON.stringify(user),
        ) as Partial<User>;
        delete userObj.passwordHash;
        return userObj;
    }

    @Patch(':id/name')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Atualiza o nome do usuário' })
    async updateName(
        @Param('id') id: string,
        @Body() updateNameDto: UpdateNameDto,
    ): Promise<User> {
        return await this.UsersService.updateName(id, updateNameDto);
    }

    @Patch(':id/password')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Atualiza a senha do usuário' })
    async updatePassword(
        @Param('id') id: string,
        @Body() updatePasswordDto: UpdatePasswordDto,
    ): Promise<User> {
        return await this.UsersService.updatePassword(id, updatePasswordDto);
    }

    @Patch(':id/favorites')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Adiciona uma receita aos favoritos do usuário' })
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
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Remove uma receita dos favoritos do usuário' })
    async removeFavoriteRecipe(
        @Param('id') id: string,
        @Param('recipeId') recipeId: string,
    ): Promise<User> {
        return await this.UsersService.removeFavoriteRecipe(id, recipeId);
    }

    @Post('/:userId/:recipeId/reviews')
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary:
            'Adiciona ou atualiza uma avaliação do usuário sobre a receita',
    })
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
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Lista os favoritos do usuário' })
    async listFavoriteRecipes(
        @Param('id') id: string,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    ): Promise<{ recipeId: string; title: string }[]> {
        return await this.UsersService.listFavoriteRecipes(id, limit, offset);
    }

    @Get('/:id/reviews')
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Lista as avaliações dos usuários sobre a receita',
    })
    async listUserReviews(
        @Param('id') id: string,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    ): Promise<{ recipeId: string; title: string }[]> {
        return await this.UsersService.listUserReviews(id, limit, offset);
    }
}
