import {
    IsNotEmpty,
    IsString,
    MinLength,
    MaxLength,
    IsInt,
    Min,
    Max,
} from 'class-validator';

export class CreateCommentDto {
    @IsString({ message: 'ID da receita deve ser uma string' })
    @IsNotEmpty({ message: 'ID da receita é obrigatório' })
    id_recipe!: string;

    @IsNotEmpty({ message: 'Nota da receita não pode ser vazia' })
    @IsInt({ message: 'Nota deve ser um número inteiro' })
    @Min(1, { message: 'Nota mínima é 1' })
    @Max(5, { message: 'Nota máxima é 5' })
    grade!: number;

    @IsString({ message: 'Comentário deve ser uma string' })
    @IsNotEmpty({ message: 'Comentário não pode ser vazio' })
    @MinLength(3, { message: 'Comentário deve ter no mínimo 3 caracteres' })
    @MaxLength(1000, {
        message: 'Comentário deve ter no máximo 1000 caracteres',
    })
    comment?: string;
}
