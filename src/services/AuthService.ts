// auth.service.ts
import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, map, Observable, tap, throwError} from 'rxjs';
import {User} from '../Model/Interfaces/User';
import {UsersService} from './Users.service';
import {environment} from '../environments/environment.development';
import {switchMap} from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authEndpoint = environment.authEndpoint;
  private usersEndpoint = environment.usersEndpoint;
  private authToken = "authToken";

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });


    return this.http.post<{ token: string }>(`${this.authEndpoint}/login`, body, {headers}).pipe(
      tap(response => {
        this.setJWToken(response.token); // Guarda el token
        this.setSessionActive(); // Marca la sesión como activa
      }),
      switchMap(() => this.getByUsername(username)), // Obtén los datos del usuario
      tap(response => {
        //console.log(response._embedded.userDTOList[0])
        this.updateSessionUser(response._embedded.userDTOList[0]); // Actualiza la sesión con los datos del usuario
      }),
      catchError(error => {
        console.error('Error al autenticar:', error);
        return throwError(() => error); // Propaga el error
      })
    );
  }

  getByUsername(username: string | null): Observable<any>{
    const params: any = {};

    // Agregar parámetros de consulta solo si no son nulos
    if (username) {
      params.username = username;
    }

    return this.http.get(this.usersEndpoint, { params });
  }


  setSessionActive() {
    localStorage.setItem('sessionActive', 'true');
  }

  setJWToken(token: string) {
    localStorage.setItem(this.authToken, token);
    console.log(token)
  }

  getJWToken() {
    return localStorage.getItem(this.authToken);
  }

  // Método para verificar si la sesión está activa
  isSessionActive(): boolean {
    return localStorage.getItem('sessionActive') === 'true';
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem('currentUser');

    return user ? JSON.parse(user) as User : null;
  }

  // Método para cerrar sesión
  logout() {
    localStorage.removeItem('sessionActive');
    localStorage.removeItem('currentUser');
    localStorage.removeItem(this.authToken);
  }

  updateSessionUser(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    console.log(user);
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user ? user.isAdmin : false;
  }
}
