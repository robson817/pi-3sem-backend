import { Controller, Post, Body, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create/create-user.dto';
import { UpdateNameDto } from './dto/update/update-name.dto';
import { User } from './users.schema';

@Controller('users')
export class UsersController {
    constructor(private readonly UsersService: UsersService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return await this.UsersService.createUser(createUserDto);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateNameDto: UpdateNameDto,
    ): Promise<User> {
        return await this.UsersService.updateName(id, updateNameDto);
    }
}
