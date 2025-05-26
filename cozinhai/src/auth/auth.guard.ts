import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface CustomRequest extends Request {
    user?: object;
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<CustomRequest>();
        const authHeader = request.headers['authorization'];
        const token =
            typeof authHeader === 'string'
                ? authHeader.replace('Bearer ', '')
                : undefined;
        if (!token) {
            console.log('Token não fornecido.');
            return false;
        }
        try {
            console.log(this.jwtService);
            const payload = this.jwtService.verify<object>(token);
            request.user = payload;
            return true;
        } catch (error: unknown) {
            console.log(error);
            console.log(
                'Authorization header:',
                request.headers['authorization'],
            );
            console.log('Token extraído:', token);
            return false;
        }
    }
}
