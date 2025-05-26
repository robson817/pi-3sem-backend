import {
    Controller,
    DefaultValuePipe,
    Get,
    Param,
    ParseIntPipe,
    Query,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import {
    ApiOperation,
    ApiTags,
    ApiParam,
    ApiQuery,
    ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Receitas')
@Controller('recipe')
export class RecipesController {
    constructor(private readonly recipesService: RecipesService) {}

    @Get('/:recipeId/reviews')
    @ApiOperation({ summary: 'Lista as avaliações sobre a receita' })
    @ApiParam({
        name: 'recipeId',
        description: 'ID da receita a ser consultada',
        example: 'abc123',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        example: 10,
        description: 'Quantidade máxima de avaliações retornadas',
    })
    @ApiQuery({
        name: 'offset',
        required: false,
        example: 0,
        description: 'Número de avaliações a serem ignoradas (paginação)',
    })
    @ApiResponse({
        status: 200,
        description: 'Avaliações retornadas com sucesso',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    date: { type: 'string', format: 'date-time' },
                    comment: { type: 'string' },
                    grade: { type: 'number', example: 4 },
                },
            },
        },
    })
    async listRecipeReviews(
        @Param('recipeId') recipeId: string,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    ): Promise<{ date: Date; comment: string; grade: number }[]> {
        return await this.recipesService.listRecipeReviews(
            recipeId,
            limit,
            offset,
        );
    }
}
