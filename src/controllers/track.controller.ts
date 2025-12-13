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
  async getTracks(): Promise<Track[]> {
    return await this.trackService.findAll();
  }

  @Get(':id')
  async getTrackById(@Param('id') id: string): Promise<Track> {
    if (!this.trackService.isValidId(id)) {
      throw new HttpException(
        { message: 'Invalid UUID' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const track: Track = await this.trackService.findOne(id);
    if (!track) {
      throw new HttpException(
        { message: 'Track not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    return track;
  }

  @Post()
  async createTrack(@Body() body: TrackDto): Promise<Track> {
    const { name, duration, albumId, artistId } = body;

    const isValidAlbumId = albumId
      ? this.trackService.isValidId(albumId)
      : true;
    const isValidArtistId = artistId
      ? this.trackService.isValidId(artistId)
      : true;

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
      );
    }

    return await this.trackService.create(body);
  }

  @Put(':id')
  async updateTrack(@Param('id') id: string, @Body() body: TrackDto): Promise<Track> {
    if (!this.trackService.isValidId(id)) {
      throw new HttpException(
        { message: 'Invalid UUID' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const track: Track = await this.trackService.findOne(id);
    if (!track) {
      throw new HttpException(
        { message: 'Track not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const { name, duration, albumId, artistId } = body;

    const isValidAlbumId = albumId
      ? this.trackService.isValidId(albumId)
      : true;
    const isValidArtistId = artistId
      ? this.trackService.isValidId(artistId)
      : true;

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
      );
    }

    return await this.trackService.update(id, body);
  }

  @Delete(':id')
  async deleteTrack(@Param('id') id: string, @Res() res: Response) {
    if (!this.trackService.isValidId(id)) {
      throw new HttpException(
        { message: 'Invalid UUID' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const track: Track = await this.trackService.findOne(id);
    if (!track) {
      throw new HttpException(
        { message: 'Track not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.trackService.delete(id);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  }
}
