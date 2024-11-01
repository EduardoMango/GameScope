import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {User} from '../Model/Interfaces/User';
import {userTitle} from '../Model/enums/user-titles';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) { }

  findUsersByName(username: string): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:3000/usuarios').pipe(
      map(users => users.filter(user =>
        user.username.toLowerCase().includes(username.toLowerCase()) && user.isActive
      ).map(user => ({
        ...user,
        currentTitle: userTitle[user.currentTitle as keyof typeof userTitle] // Convertir string a enum
      })))
    );
  }

  findUserById(id: string): Observable<User> {
    return this.http.get<User>(`http://localhost:3000/usuarios/${id}`);
  }
}
