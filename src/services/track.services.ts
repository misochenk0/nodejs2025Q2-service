import { Injectable } from '@nestjs/common';
import { Track, TrackDto } from '../types/track.types';
import { v4, validate, version } from 'uuid';
import { prisma } from '../lib/prisma';

@Injectable()
export class TrackService {

  private validateId(id: string): boolean {
    return validate(id) && version(id) === 4;
  }

  async findAll(): Promise<Track[]> {
    return prisma.track.findMany();
  }

  async findOne(id: string): Promise<Track> {
    return prisma.track.findUnique({ where: { id } });
  }

  isValidId(id: string): boolean {
    return this.validateId(id);
  }

  async create(dto: TrackDto): Promise<Track> {
    const { name, duration, albumId, artistId } = dto;

    const newTrack: Track = {
      id: v4(),
      name,
      duration,
      artistId: artistId || null,
      albumId: albumId || null,
    };

    await prisma.track.create({
      data: newTrack,
    })

    return newTrack;
  }

  async deleteAlbumId(albumId: string): Promise<void> {
    await prisma.track.updateMany({ where: { albumId }, data: {
      albumId: null
    }})
  }

  async deleteArtistId(artistId: string): Promise<void> {
    await prisma.track.updateMany({ where: { artistId }, data: {
        artistId: null
      }})
  }

  async update(id: string, body: TrackDto): Promise<Track> {
    await prisma.track.update({ where: { id }, data: body })
    return await this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await prisma.track.delete({ where: { id } });
  }
}
