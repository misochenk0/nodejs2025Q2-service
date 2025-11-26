import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Favorites, FavoritesResponse } from '../types/favourite.types';
import { validate, version } from 'uuid';
import { TrackService } from './track.services';
import { Track } from '../types/track.types';
import { AlbumsService } from './albums.services';
import { ArtistServices } from './artist.services';
import { Album } from '../types/albums.types';
import { Artist } from '../types/artist.types';

@Injectable()
export class FavouriteService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
    @Inject(forwardRef(() => ArtistServices))
    private artistServices: ArtistServices,
  ) {}

  private favourites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  findAll(): FavoritesResponse {
    return {
      tracks: this.favourites.tracks
        .map((trackId: string): Track => this.trackService.findOne(trackId))
        .filter(Boolean),
      albums: this.favourites.albums
        .map((albumId: string): Album => this.albumsService.findOne(albumId))
        .filter(Boolean),
      artists: this.favourites.artists
        .map(
          (artistId: string): Artist => this.artistServices.findOne(artistId),
        )
        .filter(Boolean),
    };
  }

  findOneTrack(id: string): string {
    return this.favourites.tracks.find(
      (track: string): boolean => track === id,
    );
  }

  findOneAlbum(id: string): string {
    return this.favourites.albums.find(
      (album: string): boolean => album === id,
    );
  }

  findOneArtist(id: string): string {
    return this.favourites.artists.find(
      (artist: string): boolean => artist === id,
    );
  }

  deleteTrack(id: string): void {
    this.favourites.tracks = this.favourites.tracks.filter(
      (track: string): boolean => track !== id,
    );
  }

  deleteAlbum(id: string): void {
    this.favourites.albums = this.favourites.albums.filter(
      (album: string): boolean => album !== id,
    );
  }

  deleteArtist(id: string): void {
    this.favourites.artists = this.favourites.artists.filter(
      (artist: string): boolean => artist !== id,
    );
  }

  addTrack(id: string): void {
    this.favourites.tracks.push(id);
  }

  addAlbum(id: string): void {
    this.favourites.albums.push(id);
  }

  addArtist(id: string): void {
    this.favourites.artists.push(id);
  }

  private validateId(id: string): boolean {
    return validate(id) && version(id) === 4;
  }

  isValidId(id: string): boolean {
    return this.validateId(id);
  }
}
