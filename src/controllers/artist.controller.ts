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
import { ArtistServices } from '../services/artist.services';
import { Artist, ArtistDto } from '../types/artist.types';
import { Response } from 'express';


@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistServices) {}

  @Get()
  getArtists(): Artist[] {
    return this.artistService.findAll()
  }

  @Get(':id')
  getArtistById(@Param('id') id: string): Artist {
    if (!this.artistService.isValidId(id)) {
      throw new HttpException(
        { message: 'Invalid UUID' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const artist: Artist = this.artistService.findOne(id);
    if (!artist) {
      throw new HttpException(
        { message: 'Artist not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    return artist;
  }

  @Post()
  createArtist(@Body() body: ArtistDto): Artist {
    const { name, grammy } = body;

    if (!name || !grammy) {
      throw new HttpException(
        { message: 'Name and grammy are required' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.artistService.create(body);
  }

  @Put(':id')
  updateArtist(@Param('id') id: string, @Body() body: ArtistDto): Artist {
    if (!this.artistService.isValidId(id)) {
      throw new HttpException(
        { message: 'Invalid UUID' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const artist: Artist = this.artistService.findOne(id);
    if (!artist) {
      throw new HttpException(
        { message: 'Artist not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const { name, grammy } = body;

    if (!name || typeof grammy !== 'boolean' || typeof name !== 'string') {
      throw new HttpException(
        { message: 'Name and grammy are required' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.artistService.update(id, body);
  }

  @Delete(':id')
  deleteArtist(@Param('id') id: string, @Res() res: Response) {
    if (!this.artistService.isValidId(id)) {
      throw new HttpException(
        { message: 'Invalid UUID' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const artist: Artist = this.artistService.findOne(id);
    if (!artist) {
      throw new HttpException(
        { message: 'Artist not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    this.artistService.delete(id);

    return res.sendStatus(HttpStatus.NO_CONTENT)
  }
}