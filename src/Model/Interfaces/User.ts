import {userTitle} from '../enums/user-titles';
import {Achievement} from './Achievement';
import {Review} from './Review';

export interface User {
  id: string;
  isAdmin: boolean;
  isActive: boolean;
  username: string;
  followers: number;
  following: string[];
  karma: number;
  email: string;
  password: string;
  currentTitle: userTitle;
  titles: userTitle[];
  img: string;
  achievements: Achievement[];
  reviews: Review[];
  notificaciones: string[];
  //recomendados: Videojuego[];
}

