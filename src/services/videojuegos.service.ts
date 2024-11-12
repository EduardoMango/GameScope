import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Videogame} from '../Model/Interfaces/videogame';
import {BehaviorSubject, catchError, map, Observable, tap} from 'rxjs';
import {VideogameGenres} from '../Model/enums/videogame-genres';
import {VideoGamePlatform} from '../Model/enums/videogamePlatform';
import {Game} from '../Model/Interfaces/game';

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

 getById(id: string): Observable<Videogame> {
   return this.http.get<Videogame>(`${this.apiURL}/${id}`);
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

  post(game:Game): Observable<Videogame> {
    const videogame: Videogame = this.convertGametoVideogame(game)

      return this.http.post<Videogame>(this.apiURL,videogame).pipe(
        tap((libro) => {
          const libros = this.videogamesSubject.getValue();
          this.videogamesSubject.next([...libros,libro]);
        })
      );
  }

  put(videogame: Videogame) {
    this.http.put<Videogame>(`${this.apiURL}/${videogame.id}`, videogame).pipe(
      tap((data) => {
        const peliculasActuales = this.videogamesSubject.value.map(
          v => v.id === videogame.id ? videogame : v
        );
        this.videogamesSubject.next(peliculasActuales);
      }),
      catchError((error) => {
        console.error(error);
        return [];
      })
    ).subscribe();
  }

  convertGametoVideogame(game: Game): Videogame {
    return {
      id: game.id,
      title: game.titulo,
      companies: game.empresas,
      image: game.imagen,
      genres: game.generos.map(genre => genre as VideogameGenres),  // Asegúrate de que los géneros correspondan a VideogameGenres
      storyline: game.storyline,
      ageRating: "E",  // Valor predeterminado para el campo ageRating, puede personalizarse
      globalScore: 0,  // Inicializa el puntaje global en 0
      releaseDate: new Date().toISOString(),  // Valor predeterminado; podrías cambiarlo si tienes una fecha específica
      platforms: game.plataformas.map(platform => platform as VideoGamePlatform),  // Conversión de plataformas
      reviews: [],  // Inicializa con una lista vacía de reseñas
      similarGames: [],  // Inicializa con una lista vacía de juegos similares
      idVideo: game.videos[0] || ''  // Toma el primer video, si está presente, o usa un string vacío
    }
  }
}
