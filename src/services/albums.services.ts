import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Album, AlbumDto } from '../types/albums.types';
import { v4, validate, version } from 'uuid';
import { TrackService } from './track.services';

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

  findAll(): Album[] {
    return this.albums;
  }

  findOne(id: string): Album {
    return this.albums.find((album: Album): boolean => album.id === id);
  }

  create(dto: AlbumDto): Album {
    const { name, year, artistId } = dto;

    const newAlbum: Album = {
      id: v4(),
      name,
      year,
      artistId: artistId || null,
    };

    this.albums.push(newAlbum);

    return newAlbum;
  }

  update(id: string, body: AlbumDto): Album {
    this.albums = this.albums.map((album: Album): Album => id === album.id ? {...album, ...body} : album);
    return this.findOne(id);
  }

  delete(id: string): void {
    this.albums = this.albums.filter((album: Album): boolean => album.id !== id);

    this.trackService.deleteAlbumId(id);
  }

  deleteArtistId(artistId: string): void {
    this.albums = this.albums.map((album: Album): Album => ({
      ...album,
      artistId: album.artistId === artistId ? null : album.artistId,
    }));
  }

  isValidId(id: string): boolean {
    return this.validateId(id);
  }
}