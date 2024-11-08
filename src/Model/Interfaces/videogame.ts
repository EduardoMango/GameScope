import {VideogameGenres} from '../enums/videogame-genres';
import {VideoGamePlatform} from '../enums/videogamePlatform';

export interface Videogame {
  id: string;
  title: string;
  companies: string[];
  image: string;
  genres: VideogameGenres[];
  storyline: string;
  ageRating: string;
  globalScore: number;
  platforms: VideoGamePlatform[];
  similarGames: string[];
}
