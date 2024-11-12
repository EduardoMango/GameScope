import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Game } from '../games/interface/game';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http: HttpClient) { }

  urlBase = environment.urlBase;

  postGame(game: Game): Observable<Game> {
    return this.http.post<Game>(this.urlBase, game);
  }
}
