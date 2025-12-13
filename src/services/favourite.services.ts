import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Favorites, FavoritesResponse } from '../types/favourite.types';
import { validate, version } from 'uuid';
import { TrackService } from './track.services';
import { Track } from '../types/track.types';
import { AlbumsService } from './albums.services';
import { ArtistServices } from './artist.services';
import { Album } from '../types/albums.types';
import { Artist } from '../types/artist.types';
import { prisma } from '../lib/prisma';

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

  async getFavourites(): Promise<Favorites> {
    return prisma.favorite.findFirst()
  }

  async findAll(): Promise<FavoritesResponse> {
    const favourites: Favorites = await this.getFavourites();
    const tracks = await Promise.all(favourites.tracks
      .map(async (trackId: string): Promise<Track> => await this.trackService.findOne(trackId)))
    const albums = await Promise.all(favourites.albums
      .map(async (albumId: string): Promise<Album> => await this.albumsService.findOne(albumId)))
    const artists = await Promise.all(favourites.artists
      .map(async (artistId: string): Promise<Artist> => await this.artistServices.findOne(artistId)))
    return {
      tracks: tracks.filter(Boolean),
      albums: albums.filter(Boolean),
      artists: artists.filter(Boolean),
    };
  }

  async findOneTrack(id: string): Promise<string> {
    const favourites: Favorites = await this.getFavourites();
    return favourites.tracks.find(
      (track: string): boolean => track === id,
    );
  }

  async findOneAlbum(id: string): Promise<string> {
    const favourites: Favorites = await this.getFavourites();
    return favourites.albums.find(
      (album: string): boolean => album === id,
    );
  }

  async findOneArtist(id: string): Promise<string> {
    const favourites: Favorites = await this.getFavourites();
    return favourites.artists.find(
      (artist: string): boolean => artist === id,
    );
  }

  async deleteTrack(id: string): Promise<void> {
    const favourites: Favorites = await this.getFavourites();
    await prisma.favorite.update({ where: { id: favourites.id }, data: { tracks: favourites.tracks.filter((track: string): boolean => track !== id) } })
  }

  async deleteAlbum(id: string): Promise<void> {
    const favourites: Favorites = await this.getFavourites();
    await prisma.favorite.update({ where: { id: favourites.id }, data: { albums: favourites.albums.filter((album: string): boolean => album !== id) } })
  }

  async deleteArtist(id: string): Promise<void> {
    const favourites: Favorites = await this.getFavourites();
    await prisma.favorite.update({ where: { id: favourites.id }, data: { artists: favourites.artists.filter((artist: string): boolean => artist !== id) } })
  }

  async addTrack(id: string): Promise<void> {
    const favourites: Favorites = await this.getFavourites();
    await prisma.favorite.update({ where: { id: favourites.id }, data: { tracks: [...favourites.tracks, id] } })
  }

  async addAlbum(id: string): Promise<void> {
    const favourites: Favorites = await this.getFavourites();
    await prisma.favorite.update({ where: { id: favourites.id }, data: { albums: [...favourites.albums, id] } })
  }

  async addArtist(id: string): Promise<void> {
    const favourites: Favorites = await this.getFavourites();
    await prisma.favorite.update({ where: { id: favourites.id }, data: { artists: [...favourites.artists, id] } })
  }

  private validateId(id: string): boolean {
    return validate(id) && version(id) === 4;
  }

  isValidId(id: string): boolean {
    return this.validateId(id);
  }
}
