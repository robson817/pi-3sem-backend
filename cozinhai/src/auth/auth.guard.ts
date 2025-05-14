import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface CustomRequest extends Request {
    user?: object;
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<CustomRequest>();
        const token = request.headers
            .get('authorization')
            ?.replace('Bearer ', '');
        if (!token) {
            return false;
        }
        try {
            const payload = this.jwtService.verify<object>(token);
            request.user = payload;
            return true;
        } catch (error) {
            console.log(error);
            console.log(
                'Authorization header:',
                request.headers.get('authorization'),
            );
            console.log('Token extraído:', token);
            return false;
        }
    }
}
