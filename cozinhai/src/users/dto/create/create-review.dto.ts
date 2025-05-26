import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsNotEmpty,
    IsString,
    MinLength,
    MaxLength,
    IsInt,
    Min,
    Max,
    IsOptional,
    IsDate,
    IsUrl,
} from 'class-validator';

export class CreateReviewDto {
    @IsOptional()
    @Type(() => Date)
    @IsDate({ message: 'Data deve ser válida' })
    @ApiProperty({
        description: 'Data de criação da avaliação',
        required: false,
    })
    date?: Date;

    @IsOptional()
    @MinLength(3, { message: 'Título deve ter no mínimo 3 caracteres' })
    @MaxLength(100, { message: 'Título deve ter no máximo 100 caracteres' })
    @ApiProperty({
        description: 'Título da receita',
        required: false,
    })
    title?: string;

    @IsString({ message: 'ID da receita deve ser uma string' })
    @IsNotEmpty({ message: 'ID da receita é obrigatório' })
    @ApiProperty({ description: 'ID da receita' })
    recipeId!: string;

    @IsOptional()
    @IsUrl({}, { message: 'A imagem da receita deve ser uma URL válida' })
    @ApiProperty({
        description: 'URL da imagem da receita',
        required: false,
    })
    recipeImage?: string;

    @IsOptional()
    @IsInt({ message: 'Nota deve ser um número inteiro' })
    @Min(1, { message: 'Nota mínima é 1' })
    @Max(5, { message: 'Nota máxima é 5' })
    @ApiProperty({
        description: 'Nota da receita',
        minimum: 1,
        maximum: 5,
        required: false,
    })
    grade?: number;

    @IsOptional()
    @IsString({ message: 'Comentário deve ser uma string' })
    @MinLength(3, { message: 'Comentário deve ter no mínimo 3 caracteres' })
    @MaxLength(1000, {
        message: 'Comentário deve ter no máximo 1000 caracteres',
    })
    @ApiProperty({
        description: 'Comentário sobre a receita',
        required: false,
    })
    comment?: string;
}
