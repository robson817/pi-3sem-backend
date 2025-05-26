import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, IsString } from 'class-validator';

export class UpdateNameDto {
    @IsString({ message: 'Nome deve ser uma string' })
    @IsNotEmpty({ message: 'Nome é obrigatório' })
    @MinLength(3, { message: 'Nome deve conter no mínimo 3 caracteres' })
    @MaxLength(30, { message: 'Nome deve conter no máximo 30 caracteres' })
    @ApiProperty({ description: 'Novo nome do usuário', required: true })
    name!: string;
}
