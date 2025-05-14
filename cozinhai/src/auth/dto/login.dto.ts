import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        example: 'usuario@email.com',
        description: 'Email do usuário',
    })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'senha123', description: 'Senha do usuário' })
    @IsString()
    password!: string;
}
