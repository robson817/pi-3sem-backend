import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    MinLength,
    MaxLength,
    Matches,
} from 'class-validator';

export class UpdatePasswordDto {
    @IsString({ message: 'Senha nova deve ser uma string' })
    @IsNotEmpty({ message: 'Senha nova não pode ser vazia' })
    @MinLength(8, { message: 'Senha nova deve conter no mínimo 8 caracteres' })
    @MaxLength(64, {
        message: 'Senha nova deve conter no máximo 64 caracteres',
    })
    @Matches(/(?=.*[A-Z])/, {
        message: 'Senha nova deve conter ao menos uma letra maiúscula',
    })
    @Matches(/(?=.*\d)/, {
        message: 'Senha nova deve conter ao menos um número',
    })
    @Matches(/(?=.*[!@#$%^&*])/, {
        message: 'Senha nova deve conter ao menos um caractere especial',
    })
    @ApiProperty({ description: 'Nova senha do usuário', required: true })
    newPassword!: string;

    @IsString({ message: 'Senha atual deve ser uma string' })
    @IsNotEmpty({ message: 'Senha atual não pode ser vazia' })
    @ApiProperty({ description: 'Atual senha do usuário', required: true })
    currentPassword!: string;
}
