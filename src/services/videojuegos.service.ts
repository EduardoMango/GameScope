import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Videogame} from '../Model/Interfaces/videogame';
import {BehaviorSubject, catchError, map, Observable, tap} from 'rxjs';
import {VideogameGenres} from '../Model/enums/videogame-genres';
import {VideoGamePlatform} from '../Model/enums/videogamePlatform';

@Injectable({
  providedIn: 'root'
})
export class VideojuegosService {

  videogamesSubject: BehaviorSubject<Videogame[]> = new BehaviorSubject<Videogame[]>([]);
  videogames$: Observable<Videogame[]> = this.videogamesSubject.asObservable();

  apiURL = 'http://localhost:3000/videogames';
  constructor(private http: HttpClient) { }

  get() {
    this.http.get<Videogame[]>(this.apiURL).pipe(
      tap((data) => this.videogamesSubject.next(data)),
      catchError((error) => {
        console.error(error);
        return [];
      })
    ).subscribe();
  }

  getByGenero(genre: VideogameGenres) {
    return this.http.get<Videogame[]>(this.apiURL).pipe(
      map((videogames) => videogames.filter((game) => game.genres.includes(genre))),
      tap((filteredGames) => {
        this.videogamesSubject.next(filteredGames);
      })
    );
  }

  getByPlatform(platform: VideoGamePlatform) {
    return this.http.get<Videogame[]>(this.apiURL).pipe(
      map((videogames) => videogames.filter((game) => game.platforms.includes(platform))),
      tap((filteredGames) => {
        this.videogamesSubject.next(filteredGames);
      })
    );
  }

  getFiltered(genre?: VideogameGenres, platform?: VideoGamePlatform, title?: string) {
    return this.http.get<Videogame[]>(this.apiURL).pipe(
      map((videogames) => videogames.filter((game) => {
        let matches = true;

        if (genre) {
          matches = matches && game.genres.includes(genre);
        }
        if (platform) {
          matches = matches && game.platforms.includes(platform);
        }
        if (title) {
          matches = matches && game.title.toLowerCase().includes(title.toLowerCase());
        }

        return matches;
      })),
      tap((filteredGames) => {
        this.videogamesSubject.next(filteredGames);
      })
    );
  }
}
