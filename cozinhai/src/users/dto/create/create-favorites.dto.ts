import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFavoritesDto {
    @IsString({ message: 'ID da receita deve ser uma string' })
    @IsNotEmpty({ message: 'ID da receita é obrigatório' })
    id_recipe!: string;

    @IsString({ message: 'Título da receita deve ser uma string' })
    @IsNotEmpty({ message: 'Título da receita é obrigatório' })
    title!: string;
}
