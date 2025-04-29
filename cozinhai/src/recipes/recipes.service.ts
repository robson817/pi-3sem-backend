import { Injectable } from '@nestjs/common';

@Injectable()
export class RecipesService {
    findAll() {
        return `This action returns all recipes`;
    }

    findOne(id: number) {
        return `This action returns a #${id} recipe`;
    }

    remove(id: number) {
        return `This action removes a #${id} recipe`;
    }
}
