import { Injectable } from '@nestjs/common';
import { validate, version, v4 } from 'uuid';
import { User, UserDto, UserPasswordDto } from '../types/user.types';
import { prisma } from '../lib/prisma';

@Injectable()
export class UsersService {

  private validateId(id: string): boolean {
    return validate(id) && version(id) === 4;
  }

  private sanitizeUser(user: User): User {
    return {
      ...user,
      password: undefined,
    };
  }

  async findAll(): Promise<User[]> {
    const users: User[] = await prisma.user.findMany()
    return users.map((user) => this.sanitizeUser(user));
  }

  async create(dto: UserDto): Promise<User> {
    const { login, password } = dto;

    const newUser: User = {
      id: v4(),
      login,
      password: String(password),
      version: 1,
      createdAt: String(Date.now()),
      updatedAt: String(Date.now()),
    };

    await prisma.user.create({
      data: newUser
    })

    return this.sanitizeUser(newUser);
  }

  async update(id, dto: UserPasswordDto): Promise<User> {
    const { newPassword } = dto;
    const user: User = await this.findOne(id);
    await prisma.user.update({ where: { id }, data: {
        version: user.version + 1,
        password: String(newPassword),
        updatedAt: String(Date.now() + 1),
      } })

    return await this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }

  async findOne(id: string, sanitize: boolean = true): Promise<User | null> {
    if (!this.validateId(id)) return null;

    const user: User = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;

    return sanitize ? this.sanitizeUser(user) : user;
  }

  isValidId(id: string): boolean {
    return this.validateId(id);
  }
}
