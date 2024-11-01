import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {User} from '../Model/Interfaces/User';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private apiUsers = 'http://localhost:3000/usuarios';

  constructor(private HttpClient: HttpClient) { }

  registerUser(user: User): Observable<User>{
    return this.HttpClient.post<User>(this.apiUsers, user);
  }
}
