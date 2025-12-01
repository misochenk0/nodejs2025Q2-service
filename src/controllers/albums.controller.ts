import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { AlbumsService } from '../services/albums.services';
import { Album, AlbumDto } from '../types/albums.types';
import { Response } from 'express';

@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  getAlbum(): Album[] {
    return this.albumsService.findAll();
  }

  @Get(':id')
  getAlbumById(@Param('id') id: string): Album {
    if (!this.albumsService.isValidId(id)) {
      throw new HttpException(
        { message: 'Invalid UUID' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const album: Album = this.albumsService.findOne(id);
    if (!album) {
      throw new HttpException(
        { message: 'Album not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    return album;
  }

  @Post()
  createAlbum(@Body() body: AlbumDto): Album {
    const { name, year, artistId } = body;

    const isValidArtistId = artistId
      ? this.albumsService.isValidId(artistId)
      : true;

    if (!name || !year) {
      throw new HttpException(
        { message: 'Name and year are required' },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!isValidArtistId) {
      throw new HttpException(
        { message: 'Invalid UUID' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.albumsService.create(body);
  }

  @Put(':id')
  updateAlbum(@Param('id') id: string, @Body() body: AlbumDto): Album {
    if (!this.albumsService.isValidId(id)) {
      throw new HttpException(
        { message: 'Invalid UUID' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const album: Album = this.albumsService.findOne(id);
    if (!album) {
      throw new HttpException(
        { message: 'Album not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const { name, year, artistId } = body;

    const isValidArtistId: boolean = artistId
      ? this.albumsService.isValidId(artistId)
      : true;

    if (!name || !year) {
      throw new HttpException(
        { message: 'Name and year are required' },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!isValidArtistId) {
      throw new HttpException(
        { message: 'Invalid UUID' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.albumsService.update(id, body);
  }

  @Delete(':id')
  deleteAlbum(@Param('id') id: string, @Res() res: Response) {
    if (!this.albumsService.isValidId(id)) {
      throw new HttpException(
        { message: 'Invalid UUID' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const album: Album = this.albumsService.findOne(id);
    if (!album) {
      throw new HttpException(
        { message: 'Album not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    this.albumsService.delete(id);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  }
}
