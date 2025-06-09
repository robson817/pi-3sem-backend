import { Body, Controller, Post, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() body: LoginDto) {
        if (!body.email || !body.password) {
            return { message: 'Informe email e senha para efetuar o login' };
        }

        try {
            this.logger.debug(`Tentativa de login para: ${body.email}`);
            const user = await this.authService.validateUser(
                body.email,
                body.password,
            );
            if (user) {
                this.logger.debug('Login bem sucedido');
                return this.authService.login(user);
            }

            return { message: 'Usuário ou senha inválidos' };
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error(
                    `Erro no login: ${error.message}`,
                    error.stack,
                );
            } else {
                this.logger.error('Erro no login: erro desconhecido');
            }
            throw error;
        }
    }
}
