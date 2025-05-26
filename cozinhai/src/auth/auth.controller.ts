import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiOperation({ summary: 'Realiza o login do usuário' })
    @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
    @ApiResponse({ status: 401, description: 'Usuário ou senha inválidos' })
    @ApiBody({ type: LoginDto })
    async login(@Body() body: LoginDto) {
        if (!body.email || !body.password) {
            return { message: 'Informe email e senha para efetuar o login' };
        }

        const user = await this.authService.validateUser(
            body.email,
            body.password,
        );

        if (user) {
            return this.authService.login(user);
        }

        return { message: 'Usuário ou senha inválidos' };
    }
}
