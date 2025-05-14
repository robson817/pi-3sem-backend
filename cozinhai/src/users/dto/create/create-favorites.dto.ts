import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateFavoritesDto {
    @IsString({ message: 'ID da receita deve ser uma string' })
    @IsNotEmpty({ message: 'ID da receita é obrigatório' })
    @ApiProperty({ description: 'ID da receita' })
    id!: string;

    @IsString({ message: 'Título da receita deve ser uma string' })
    @IsNotEmpty({ message: 'Título da receita é obrigatório' })
    @ApiProperty({ description: 'Título da receita' })
    title!: string;

    @IsOptional()
    @IsUrl({}, { message: 'A imagem da receita deve ser uma URL válida' })
    @ApiProperty({
        description: 'URL da imagem da receita',
        required: false,
    })
    recipeImage?: string;
}
