import { Module } from '@nestjs/common';
import { UsersController } from './controllers/user.controller';
import { UsersService } from './services/user.services'
import { TrackController } from './controllers/track.controller';
import { TrackService } from './services/track.services';
import { AlbumsService } from './services/albums.services';
import { AlbumsController } from './controllers/albums.controller';

@Module({
  imports: [],
  controllers: [UsersController, TrackController, AlbumsController],
  providers: [UsersService, TrackService, AlbumsService],
})
export class AppModule {}
