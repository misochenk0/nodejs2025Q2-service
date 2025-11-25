import { Injectable } from '@nestjs/common';
import { validate, version, v4 } from 'uuid';
import { User, UserDto, UserPasswordDto } from '../types/user.types';

@Injectable()
export class UsersService {
  private users: User[] = [];

  private validateId(id: string): boolean {
    return validate(id) && version(id) === 4;
  }

  private sanitizeUser(user: User): User {
    return {
      ...user,
      password: undefined,
    };
  }

  findAll(): User[] {
    return this.users.map((user) => this.sanitizeUser(user));
  }

  create(dto: UserDto): User {
    const { login, password } = dto;

    const newUser: User = {
      id: v4(),
      login,
      password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.push(newUser);

    return this.sanitizeUser(newUser);
  }

  update(id, dto: UserPasswordDto): User {
    const { newPassword } = dto;
    this.users = this.users.map((user: User): User => id === user.id
      ? {
          ...user,
          version: user.version + 1,
          password: newPassword,
          updatedAt: Date.now() + 1,
        }
      : user
    )

    return this.findOne(id);
  }

  delete(id: string): void {
    this.users = this.users.filter((user: User): boolean => user.id !== id);
  }

  findOne(id: string, sanitize: boolean = true): User | null {
    if (!this.validateId(id)) return null;

    const user: User = this.users.find((u: User): boolean => u.id === id);
    if (!user) return null;

    return sanitize ? this.sanitizeUser(user) : user;
  }

  isValidId(id: string): boolean {
    return this.validateId(id);
  }
}