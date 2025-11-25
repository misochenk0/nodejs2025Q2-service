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
  getUsers() {
    return this.usersService.findAll();
  }

  @Post()
  createUser(@Body() body: UserDto): User {
    const { login, password } = body;

    if (!login || !password) {
      throw new HttpException(
        { message: 'Login and password are required' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.usersService.create({ login, password });
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() body: UserPasswordDto): User {
    if (!this.usersService.isValidId(id)) {
      throw new HttpException(
        { message: 'Invalid UUID' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const user: User = this.usersService.findOne(id, false);
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

    return this.usersService.update(id, body)
  }

  @Get(':id')
  getUserById(@Param('id') id: string): User {
    if (!this.usersService.isValidId(id)) {
      throw new HttpException(
        { message: 'Invalid UUID' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user: User = this.usersService.findOne(id);
    if (!user) {
      throw new HttpException(
        { message: 'User not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string, @Res() res: Response) {
    if (!this.usersService.isValidId(id)) {
      throw new HttpException(
        { message: 'Invalid UUID' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const user: User = this.usersService.findOne(id);
    if (!user) {
      throw new HttpException(
        { message: 'User not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    this.usersService.delete(id);

    return res.sendStatus(HttpStatus.NO_CONTENT)
  }
}