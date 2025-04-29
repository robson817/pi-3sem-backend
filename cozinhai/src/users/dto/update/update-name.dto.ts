import { IsNotEmpty, MinLength, MaxLength, IsString } from 'class-validator';

export class UpdateNameDto {
    @IsString({ message: 'Nome deve ser string' })
    @IsNotEmpty({ message: 'Nome é obrigatório' })
    @MinLength(3, { message: 'Nome deve conter no mínimo três dígitos' })
    @MaxLength(30, { message: 'Nome deve conter no máximo trinta dígitos' })
    name!: string;
}
