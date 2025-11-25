import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersController } from './controllers/user.controller';
import { UsersService } from './services/user.services'
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
