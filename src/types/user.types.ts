export interface User {
  id: string; // uuid v4
  login: string;
  password?: string;
  version: number; // integer number, increments on update
  createdAt: string; // timestamp of creation
  updatedAt: string; // timestamp of last update
}

export interface UserDto {
  login: string;
  password: string;
}

export interface UserPasswordDto {
  oldPassword: string;
  newPassword: string;
}
