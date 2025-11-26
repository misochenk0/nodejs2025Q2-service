import { Injectable } from '@nestjs/common';
import { Track, TrackDto } from '../types/track.types';
import { v4, validate, version } from 'uuid';

@Injectable()
export class TrackService {
  private tracks: Track[] = [];


  private validateId(id: string): boolean {
    return validate(id) && version(id) === 4;
  }

  findAll(): Track[] {
    return this.tracks;
  }

  findOne(id: string): Track {
    return this.tracks.find((track: Track): boolean => track.id === id);
  }

  isValidId(id: string): boolean {
    return this.validateId(id);
  }

  create(dto: TrackDto): Track {
    const { name, duration, albumId, artistId } = dto;

    const newTrack: Track = {
      id: v4(),
      name,
      duration,
      artistId: artistId || null,
      albumId: albumId || null,
    };

    this.tracks.push(newTrack);

    return newTrack;
  }

  deleteAlbumId(albumId: string): void {
    this.tracks = this.tracks.map((track: Track): Track => ({
      ...track,
      albumId: track.albumId === albumId ? null : track.albumId,
    }));
  }

  deleteArtistId(artistId: string): void {
    this.tracks = this.tracks.map((track: Track): Track => ({
      ...track,
      artistId: track.artistId === artistId ? null : track.artistId,
    }));
  }

  update(id: string, body: TrackDto): Track {
    this.tracks = this.tracks.map((track: Track): Track => id === track.id ? {...track, ...body} : track);
    return this.findOne(id);
  }

  delete(id: string): void {
    this.tracks = this.tracks.filter((track: Track): boolean => track.id !== id);
  }
}