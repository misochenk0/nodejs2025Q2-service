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
  async getArtists(): Promise<Artist[]> {
    return await this.artistService.findAll();
  }

  @Get(':id')
  async getArtistById(@Param('id') id: string): Promise<Artist> {
    if (!this.artistService.isValidId(id)) {
      throw new HttpException(
        { message: 'Invalid UUID' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const artist: Artist = await this.artistService.findOne(id);
    if (!artist) {
      throw new HttpException(
        { message: 'Artist not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    return artist;
  }

  @Post()
  async createArtist(@Body() body: ArtistDto): Promise<Artist> {
    const { name, grammy } = body;

    if (!name || !grammy) {
      throw new HttpException(
        { message: 'Name and grammy are required' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.artistService.create(body);
  }

  @Put(':id')
  async updateArtist(@Param('id') id: string, @Body() body: ArtistDto): Promise<Artist> {
    if (!this.artistService.isValidId(id)) {
      throw new HttpException(
        { message: 'Invalid UUID' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const artist: Artist = await this.artistService.findOne(id);
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

    return await this.artistService.update(id, body);
  }

  @Delete(':id')
  async deleteArtist(@Param('id') id: string, @Res() res: Response) {
    if (!this.artistService.isValidId(id)) {
      throw new HttpException(
        { message: 'Invalid UUID' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const artist: Artist = await this.artistService.findOne(id);
    if (!artist) {
      throw new HttpException(
        { message: 'Artist not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.artistService.delete(id);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  }
}
