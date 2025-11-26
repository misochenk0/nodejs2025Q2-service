import { Artist } from './artist.types';
import { Album } from './albums.types';
import { Track } from './track.types';

export interface Favorites {
  artists: string[]; // favorite artists ids
  albums: string[]; // favorite albums ids
  tracks: string[]; // favorite tracks ids
}

export interface FavoritesResponse{
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}