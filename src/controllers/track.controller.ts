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
import { TrackService } from '../services/track.services';
import { Track, TrackDto } from '../types/track.types';
import { Response } from 'express';


@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  getTracks(): Track[] {
    return this.trackService.findAll()
  }

  @Get(':id')
  getTrackById(@Param('id') id: string): Track {
    if (!this.trackService.isValidId(id)) {
      throw new HttpException(
        { message: 'Invalid UUID' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const track: Track = this.trackService.findOne(id);
    if (!track) {
      throw new HttpException(
        { message: 'Track not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    return track;
  }

  @Post()
  createTrack(@Body() body: TrackDto): Track {
    const { name, duration, albumId, artistId } = body;

    const isValidAlbumId = albumId ? this.trackService.isValidId(albumId) : true;
    const isValidArtistId = artistId ? this.trackService.isValidId(artistId) : true;

    if (!name || !duration) {
      throw new HttpException(
        { message: 'Name and duration are required' },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!isValidAlbumId || !isValidArtistId) {
      throw new HttpException(
        { message: 'Invalid UUID' },
        HttpStatus.BAD_REQUEST,
      )
    }

    return this.trackService.create(body);
  }

  @Put(':id')
  updateTrack(@Param('id') id: string, @Body() body: TrackDto): Track {
    if (!this.trackService.isValidId(id)) {
      throw new HttpException(
        { message: 'Invalid UUID' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const track: Track = this.trackService.findOne(id);
    if (!track) {
      throw new HttpException(
        { message: 'Track not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const { name, duration, albumId, artistId } = body;

    const isValidAlbumId = albumId ? this.trackService.isValidId(albumId) : true;
    const isValidArtistId = artistId ? this.trackService.isValidId(artistId) : true;

    if (!name || !duration) {
      throw new HttpException(
        { message: 'Name and duration are required' },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!isValidAlbumId || !isValidArtistId) {
      throw new HttpException(
        { message: 'Invalid UUID' },
        HttpStatus.BAD_REQUEST,
      )
    }

    return this.trackService.update(id, body);
  }

  @Delete(':id')
  deleteTrack(@Param('id') id: string, @Res() res: Response) {
    if (!this.trackService.isValidId(id)) {
      throw new HttpException(
        { message: 'Invalid UUID' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const track: Track = this.trackService.findOne(id);
    if (!track) {
      throw new HttpException(
        { message: 'Track not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    this.trackService.delete(id);

    return res.sendStatus(HttpStatus.NO_CONTENT)
  }
}