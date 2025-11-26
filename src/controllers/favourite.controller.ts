import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { FavoritesResponse } from '../types/favourite.types';
import { FavouriteService } from '../services/favourite.services';
import { TrackService } from '../services/track.services';
import { Track } from '../types/track.types';
import { Response } from 'express';
import { AlbumsService } from '../services/albums.services';
import { Album } from '../types/albums.types';
import { ArtistServices } from '../services/artist.services';
import { Artist } from '../types/artist.types';

@Controller('favs')
export class FavouriteController {
  constructor(
    private readonly favouriteService: FavouriteService,
    private readonly trackService: TrackService,
    private readonly albumService: AlbumsService,
    private readonly artistService: ArtistServices,
  ) {}

  @Get()
  getFavourites(): FavoritesResponse {
    return this.favouriteService.findAll();
  }

  @Post('track/:id')
  addTrackToFavourites(@Param('id') id: string, @Res() res: Response) {
    if (!this.favouriteService.isValidId(id)) {
      throw new HttpException(
        { message: 'Invalid UUID' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const track: Track = this.trackService.findOne(id);
    const trackId: string = this.favouriteService.findOneTrack(id);
    if (!track) {
      throw new HttpException(
        { message: 'Track does not exist' },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    if (trackId) {
      throw new HttpException(
        { message: 'Track already in favourites' },
        HttpStatus.CONFLICT,
      );
    }

    this.favouriteService.addTrack(id);
    return res.sendStatus(HttpStatus.CREATED);
  }
  @Delete('track/:id')
  deleteTrackFromFavourites(@Param('id') id: string, @Res() res: Response) {
    if (!this.favouriteService.isValidId(id)) {
      throw new HttpException(
        { message: 'Invalid UUID' },
        HttpStatus.BAD_REQUEST,
      );
    }
    // const track: Track = this.trackService.findOne(id);
    const trackId: string = this.favouriteService.findOneTrack(id);
    if (!trackId) {
      throw new HttpException(
        { message: 'Track does not exist in favourites' },
        HttpStatus.NOT_FOUND,
      );
    }

    this.favouriteService.deleteTrack(id);

    res.sendStatus(HttpStatus.NO_CONTENT);
  }

  @Post('album/:id')
  addAlbumToFavourites(@Param('id') id: string, @Res() res: Response) {
    if (!this.favouriteService.isValidId(id)) {
      throw new HttpException(
        { message: 'Invalid UUID' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const album: Album = this.albumService.findOne(id);
    const albumId: string = this.favouriteService.findOneAlbum(id);
    if (!album) {
      throw new HttpException(
        { message: 'Track does not exist' },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    if (albumId) {
      throw new HttpException(
        { message: 'Album already in favourites' },
        HttpStatus.CONFLICT,
      );
    }

    this.favouriteService.addAlbum(id);
    return res.sendStatus(HttpStatus.CREATED);
  }
  @Delete('album/:id')
  deleteAlbumFromFavourites(@Param('id') id: string, @Res() res: Response) {
    if (!this.favouriteService.isValidId(id)) {
      throw new HttpException(
        { message: 'Invalid UUID' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const albumId: string = this.favouriteService.findOneAlbum(id);
    if (!albumId) {
      throw new HttpException(
        { message: 'Album does not exist in favourites' },
        HttpStatus.NOT_FOUND,
      );
    }

    this.favouriteService.deleteAlbum(id);

    res.sendStatus(HttpStatus.NO_CONTENT);
  }

  @Post('artist/:id')
  addArtistToFavourites(@Param('id') id: string, @Res() res: Response) {
    if (!this.favouriteService.isValidId(id)) {
      throw new HttpException(
        { message: 'Invalid UUID' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const artist: Artist = this.artistService.findOne(id);
    const artistId: string = this.favouriteService.findOneArtist(id);
    if (!artist) {
      throw new HttpException(
        { message: 'Artist does not exist' },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    if (artistId) {
      throw new HttpException(
        { message: 'Artist already in favourites' },
        HttpStatus.CONFLICT,
      );
    }

    this.favouriteService.addArtist(id);
    return res.sendStatus(HttpStatus.CREATED);
  }
  @Delete('artist/:id')
  deleteArtistFromFavourites(@Param('id') id: string, @Res() res: Response) {
    if (!this.favouriteService.isValidId(id)) {
      throw new HttpException(
        { message: 'Invalid UUID' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const artistId: string = this.favouriteService.findOneArtist(id);
    if (!artistId) {
      throw new HttpException(
        { message: 'Artist does not exist in favourites' },
        HttpStatus.NOT_FOUND,
      );
    }

    this.favouriteService.deleteArtist(id);

    res.sendStatus(HttpStatus.NO_CONTENT);
  }
}
