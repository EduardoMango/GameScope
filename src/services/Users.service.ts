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

  private apiUsers = 'http://localhost:3000/usuarios';

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

  isUsernameTaken(username: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.apiUsers}?username=${username}`).pipe(
      map(users => users.length > 0)
    );
  }

  isEmailTaken(email: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.apiUsers}?email=${email}`).pipe(
      map(users => users.length > 0)
    );
  }

  registerUser(user: User): Observable<User>{
    return this.http.post<User>(this.apiUsers, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`http://localhost:3000/usuarios/${user.id}`, user);
  }

  getAllUsers():Observable<User[]>{
  return this.http.get<User[]>('http://localhost:3000/usuarios');
  }
}
