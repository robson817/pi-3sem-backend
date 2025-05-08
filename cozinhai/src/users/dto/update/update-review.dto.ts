//Unificado apenas um dto com o create devido ao controller só poder receber receber um body.

// import {
//     IsNotEmpty,
//     IsString,
//     MinLength,
//     MaxLength,
//     IsInt,
//     Min,
//     Max,
//     IsOptional,
// } from 'class-validator';

// export class UpdateReviewDto {
//     @IsString({ message: 'ID da receita deve ser uma string' })
//     @IsNotEmpty({ message: 'ID da receita é obrigatório' })
//     id!: string;

//     @IsOptional()
//     @IsInt({ message: 'Nota deve ser um número inteiro' })
//     @Min(1, { message: 'Nota mínima é 1' })
//     @Max(5, { message: 'Nota máxima é 5' })
//     grade?: number;

//     @IsOptional()
//     @IsString({ message: 'Comentário deve ser uma string' })
//     @MinLength(3, { message: 'Comentário deve ter no mínimo 3 caracteres' })
//     @MaxLength(1000, {
//         message: 'Comentário deve ter no máximo 1000 caracteres',
//     })
//     comment?: string;
// }
