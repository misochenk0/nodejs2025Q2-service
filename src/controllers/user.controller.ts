import {
  Body,
  Controller,
  Get,
  Put,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Res,
  Post,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from '../services/user.services';
import { User, UserDto, UserPasswordDto } from '../types/user.types';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Post()
  async createUser(@Body() body: UserDto): Promise<User> {
    const { login, password } = body;

    if (!login || !password) {
      throw new HttpException(
        { message: 'Login and password are required' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.usersService.create({ login, password });
  }

  @Put(':id')
  async pdateUser(@Param('id') id: string, @Body() body: UserPasswordDto): Promise<User> {
    if (!this.usersService.isValidId(id)) {
      throw new HttpException(
        { message: 'Invalid UUID' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const user: User = await this.usersService.findOne(id, false);
    const { oldPassword, newPassword } = body;
    if (!oldPassword || !newPassword) {
      throw new HttpException(
        { message: 'Old password and new password are required' },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!user) {
      throw new HttpException(
        { message: 'User not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    if (oldPassword !== user.password) {
      throw new HttpException(
        { message: 'Incorrect old password' },
        HttpStatus.FORBIDDEN,
      );
    }

    return await this.usersService.update(id, body);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    if (!this.usersService.isValidId(id)) {
      throw new HttpException(
        { message: 'Invalid UUID' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user: User = await this.usersService.findOne(id);
    if (!user) {
      throw new HttpException(
        { message: 'User not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    if (!this.usersService.isValidId(id)) {
      throw new HttpException(
        { message: 'Invalid UUID' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const user: User = await this.usersService.findOne(id);
    if (!user) {
      throw new HttpException(
        { message: 'User not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.usersService.delete(id);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  }
}
