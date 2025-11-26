import { Module } from '@nestjs/common';
import { UsersController } from './controllers/user.controller';
import { UsersService } from './services/user.services';
import { TrackController } from './controllers/track.controller';
import { TrackService } from './services/track.services';
import { AlbumsService } from './services/albums.services';
import { AlbumsController } from './controllers/albums.controller';
import { ArtistServices } from './services/artist.services';
import { ArtistController } from './controllers/artist.controller';
import { FavouriteService } from './services/favourite.services';
import { FavouriteController } from './controllers/favourite.controller';

@Module({
  imports: [],
  controllers: [
    UsersController,
    TrackController,
    AlbumsController,
    ArtistController,
    FavouriteController,
  ],
  providers: [
    UsersService,
    TrackService,
    AlbumsService,
    ArtistServices,
    FavouriteService,
  ],
})
export class AppModule {}
