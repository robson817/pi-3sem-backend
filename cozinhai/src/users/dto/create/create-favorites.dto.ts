import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateFavoritesDto {
    @IsString({ message: 'ID da receita deve ser uma string' })
    @IsNotEmpty({ message: 'ID da receita é obrigatório' })
    id!: string;

    @IsString({ message: 'Título da receita deve ser uma string' })
    @IsNotEmpty({ message: 'Título da receita é obrigatório' })
    title!: string;

    @IsOptional()
    @IsUrl({}, { message: 'A imagem da receita deve ser uma URL válida' })
    recipeImage?: string;
}
