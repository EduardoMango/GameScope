import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Videogame} from '../Model/Interfaces/videogame';
import {BehaviorSubject, catchError, EMPTY, map, Observable, tap, throwError} from 'rxjs';
import {VideogameGenres} from '../Model/enums/videogame-genres';
import {VideoGamePlatform} from '../Model/enums/videogamePlatform';
import {Game} from '../Model/Interfaces/game';
import {switchMap} from 'rxjs/operators';
import { environment } from '../environments/environment.development';
import { Review, Comment } from '../Model/Interfaces/Review';
import {AuthService} from './AuthService';

@Injectable({
  providedIn: 'root'
})
export class VideojuegosService {

  videogamesSubject: BehaviorSubject<Videogame[]> = new BehaviorSubject<Videogame[]>([]);
  videogames$: Observable<Videogame[]> = this.videogamesSubject.asObservable();

  urlBase = environment.urlBase;
  private videogamesEndpoint = environment.videogamesEndpoint

  constructor(private http: HttpClient,
              private authService: AuthService) { }

  get() {
    this.http.get<Videogame[]>(this.urlBase).pipe(
      tap((data) => this.videogamesSubject.next(data)),
      catchError((error) => {
        console.error(error);
        return [];
      })
    ).subscribe();
  }

 getById(id: string): Observable<Videogame> {
   return this.http.get<Videogame>(`${this.urlBase}/${id}`);
 }
  getFiltered(genre?: VideogameGenres, platform?: VideoGamePlatform, title?: string) {
    return this.http.get<Videogame[]>(this.urlBase).pipe(
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
    const token = this.authService.getJWToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Bearer seguido del token
    });

    return this.http.post<Videogame>(this.videogamesEndpoint, videogame, {headers}).pipe(
      tap((data) => {
        const videogamesActuales = this.videogamesSubject.value;
        this.videogamesSubject.next([...videogamesActuales, data]);
      }),
      catchError((error) => {
        console.log(headers);
        throw error;
      })
    )
  }

  put(videogame: Videogame) {
    this.http.put<Videogame>(`${this.urlBase}/${videogame.id}`, videogame).pipe(
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
      releaseDate: game.fechaLanzamiento,  // Valor predeterminado; podrías cambiarlo si tienes una fecha específica
      platforms: game.plataformas.map(platform => platform as VideoGamePlatform),  // Conversión de plataformas
      reviews: [],  // Inicializa con una lista vacía de reseñas
      similarGames: game.similarGames.map((id) => id.toString()),  // Inicializa con una lista vacía de juegos similares
      idVideo: game.videos[0] || ''  // Toma el primer video, si está presente, o usa un string vacío
    }
  }


/** ESTO AGREGUE PARA COMENTARIOS */

updateVideogame(id: string, videogame: Videogame): Observable<Videogame> {
  const url = `${this.urlBase}/${id}`; // Ajusta la URL al endpoint de videojuegos
  return this.http.put<Videogame>(url, videogame);
}

}



