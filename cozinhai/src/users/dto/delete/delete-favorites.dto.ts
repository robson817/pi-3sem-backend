import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteFavoritesDto {
    @IsString({ message: 'ID da receita deve ser uma string' })
    @IsNotEmpty({ message: 'ID da receita é obrigatório' })
    id!: string;
}
