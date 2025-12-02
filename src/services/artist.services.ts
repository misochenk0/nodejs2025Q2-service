import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Artist, ArtistDto } from '../types/artist.types';
import { v4, validate, version } from 'uuid';
import { TrackService } from './track.services';
import { AlbumsService } from './albums.services';
import { prisma } from '../lib/prisma';

@Injectable()
export class ArtistServices {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
  ) {}


  private validateId(id: string): boolean {
    return validate(id) && version(id) === 4;
  }

  async findAll(): Promise<Artist[]> {
    return prisma.artist.findMany();
  }

  async findOne(id: string): Promise<Artist> {
    return prisma.artist.findUnique({ where: { id } });
  }

  isValidId(id: string): boolean {
    return this.validateId(id);
  }

  async create(dto: ArtistDto): Promise<Artist> {
    const { name, grammy } = dto;

    const newArtist: Artist = {
      id: v4(),
      name,
      grammy,
    };

    await prisma.artist.create({ data: newArtist })

    return newArtist;
  }

  async update(id: string, body: ArtistDto): Promise<Artist> {
    await prisma.artist.update({ where: { id }, data: body })
    return await this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    prisma.artist.delete({ where: { id } });

    await this.trackService.deleteArtistId(id);
    await this.albumsService.deleteArtistId(id);
  }
}
