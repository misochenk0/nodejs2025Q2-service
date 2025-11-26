import { Injectable } from '@nestjs/common';
import { Artist, ArtistDto } from '../types/artist.types';
import { v4, validate, version } from 'uuid';

@Injectable()
export class ArtistServices {
  private artists: Artist[] = [];


  private validateId(id: string): boolean {
    return validate(id) && version(id) === 4;
  }

  findAll(): Artist[] {
    return this.artists;
  }

  findOne(id: string): Artist {
    return this.artists.find((artist: Artist): boolean => artist.id === id);
  }

  isValidId(id: string): boolean {
    return this.validateId(id);
  }

  create(dto: ArtistDto): Artist {
    const { name, grammy } = dto;

    const newArtist: Artist = {
      id: v4(),
      name,
      grammy,
    };

    this.artists.push(newArtist);

    return newArtist;
  }

  update(id: string, body: ArtistDto): Artist {
    this.artists = this.artists.map((artist: Artist): Artist => id === artist.id ? {...artist, ...body} : artist);
    return this.findOne(id);
  }

  delete(id: string): void {
    this.artists = this.artists.filter((artist: Artist): boolean => artist.id !== id);
  }
}