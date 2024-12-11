import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {NewUser, User} from '../Model/Interfaces/User';
import {userTitle} from '../Model/enums/user-titles';
import {environment} from '../environments/environment.development';
import {AuthService} from './AuthService';
import {VideogameResponse} from '../Model/Interfaces/VideogameResponse';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUsers = environment.apiUsers;
  private usersEndpoint = environment.usersEndpoint;

  constructor(private http: HttpClient,
              private authService: AuthService) { }

  findUsersByName(username: string): Observable<User[]> {
    return this.http.get<User[]>(this.apiUsers).pipe(
      map(users => users.filter(user =>
        user.username.toLowerCase().includes(username.toLowerCase()) && user.isActive
      ).map(user => ({
        ...user,
        currentTitle: userTitle[user.currentTitle as keyof typeof userTitle] // Convertir string a enum
      })))
    );
  }

  findUserById(id: string | any): Observable<User> {
    return this.http.get<User>(`${this.apiUsers}/${id}`);
  }

  getByUsername(username: string | null): Observable<any>{
    const params: any = {};

    // Agregar parámetros de consulta solo si no son nulos
    if (username) {
      params.username = username;
    }

    return this.http.get(this.usersEndpoint, { params });
  }


  registerUser(user: NewUser): Observable<User>{
    return this.http.post<User>(this.usersEndpoint, user);
  }

  getLibrary(idUser: string): Observable<VideogameResponse> {
    return this.http.get<VideogameResponse>(`${this.usersEndpoint}/${idUser}/games`);
  }

  addVideogameToLibrary(idUser: string, idVideogame: string){
    const token = this.authService.getJWToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Bearer seguido del token
    });
    return this.http.post<User>(`${this.usersEndpoint}/${idUser}/games/${idVideogame}`,{},{headers});
  }

  removeVideogameFromLibrary(idUser: string, idVideogame: string){
    const token = this.authService.getJWToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Bearer seguido del token
    });
    return this.http.delete<void>(`${this.usersEndpoint}/${idUser}/games/${idVideogame}`,{headers});
  }


  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUsers}/${user.id}`, user);
  }

  banUser(user: User): Observable<User>{
    user.isActive = false;
    user.isBanned = true;

    return this.http.put<User>(`${this.apiUsers}/${user.id}`, user);
  }

  switchActiveUser(user: User): Observable<User>{
    user.isActive = !user.isActive;

    return this.http.put<User>(`${this.apiUsers}/${user.id}`, user);
  }

  getAllUsers():Observable<User[]>{
  return this.http.get<User[]>('http://localhost:3000/usuarios');
  }


  /** ESTO AGREGUE PARA COMENTARIOS */
  updateUser2(id: string, user: User): Observable<User> {
    const url = `${this.apiUsers}/${id}`; // Ajusta la URL al endpoint de usuarios
    return this.http.put<User>(url, user);
  }

}
