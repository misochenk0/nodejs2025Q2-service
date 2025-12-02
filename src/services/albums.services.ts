import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Album, AlbumDto } from '../types/albums.types';
import { v4, validate, version } from 'uuid';
import { TrackService } from './track.services';
import { prisma } from '../lib/prisma';

@Injectable()
export class AlbumsService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
  ) {}

  private albums: Album[] = [];

  private validateId(id: string): boolean {
    return validate(id) && version(id) === 4;
  }

  async findAll(): Promise<Album[]> {
    return prisma.album.findMany();
  }

  async findOne(id: string): Promise<Album> {
    return prisma.album.findUnique({ where: { id } });
  }

  async create(dto: AlbumDto): Promise<Album> {
    const { name, year, artistId } = dto;

    const newAlbum: Album = {
      id: v4(),
      name,
      year,
      artistId: artistId || null,
    };

    await prisma.album.create({ data: newAlbum })

    return newAlbum;
  }

  async update(id: string, body: AlbumDto): Promise<Album> {
    await prisma.album.update({ where: { id }, data: body })
    return await this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await prisma.album.delete({ where: { id } });
    await this.trackService.deleteAlbumId(id);
  }

  async deleteArtistId(artistId: string): Promise<void> {
    await prisma.album.updateMany({ where: { artistId }, data: {
      artistId: null
    }})
  }

  isValidId(id: string): boolean {
    return this.validateId(id);
  }
}
