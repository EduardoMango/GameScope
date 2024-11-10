import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User} from '../Model/Interfaces/User';
import { userTitle } from '../Model/enums/user-titles';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) { }
  apiUsers = environment.apiUsers;
  user: User | null = null;

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

  /*findUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUsers}/user/${id}`);
  }*/

  findUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUsers}/${id}`);
  }

  registerUser(user: User): Observable<User>{
    return this.http.post<User>(this.apiUsers, user);
  }

  deleteUser(id: string | null): Observable<void>{
    return this.http.delete<void>(`${this.apiUsers}/${id}`);
  }

  putUser(user: User, id: string | null): Observable<User>{
    return this.http.put<User>(`${this.apiUsers}/${id}`, user);
  }
}
