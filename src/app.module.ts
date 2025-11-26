import { Module } from '@nestjs/common';
import { UsersController } from './controllers/user.controller';
import { UsersService } from './services/user.services'
import { TrackController } from './controllers/track.controller';
import { TrackService } from './services/track.services';
import { AlbumsService } from './services/albums.services';
import { AlbumsController } from './controllers/albums.controller';
import { ArtistServices } from './services/artist.services';
import { ArtistController } from './controllers/artist.controller';

@Module({
  imports: [],
  controllers: [UsersController, TrackController, AlbumsController, ArtistController],
  providers: [UsersService, TrackService, AlbumsService, ArtistServices],
})
export class AppModule {}
