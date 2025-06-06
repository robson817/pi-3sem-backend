import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsEmail,
    IsString,
    MinLength,
    MaxLength,
    Matches,
} from 'class-validator';

export class CreateUserDto {
    @IsString({ message: 'Nome deve ser uma string' })
    @IsNotEmpty({ message: 'Nome não pode ser vazio' })
    @MinLength(3, { message: 'Nome deve conter no mínimo três caracteres' })
    @MaxLength(30, { message: 'Nome deve conter no máximo trinta caracteres' })
    @ApiProperty({ description: 'Nome do usuário', required: true })
    name!: string;

    @IsString({ message: 'Email deve ser uma string' })
    @IsEmail({}, { message: 'Email inválido' })
    @IsNotEmpty({ message: 'Email não pode ser vazio' })
    @ApiProperty({ description: 'Email do usuário', required: true })
    email!: string;

    @IsString({ message: 'Senha deve ser uma string' })
    @IsNotEmpty({ message: 'Senha não pode ser vazia' })
    @MinLength(8, { message: 'Senha deve conter no mínimo 8 caracteres' })
    @MaxLength(64, { message: 'Senha deve conter no máximo 64 caracteres' })
    @Matches(/(?=.*[A-Z])/, {
        message: 'Senha deve conter ao menos uma letra maiúscula',
    })
    @Matches(/(?=.*[a-z])/, {
        message: 'Senha deve conter ao menos uma letra minúscula',
    })
    @Matches(/(?=.*\d)/, {
        message: 'Senha deve conter ao menos um número',
    })
    @Matches(/(?=.*[!@#$%^&*])/, {
        message: 'Senha deve conter ao menos um caractere especial',
    })
    @ApiProperty({ description: 'Senha do usuário', required: true })
    password!: string;
}
