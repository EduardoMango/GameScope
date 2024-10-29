// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/usuarios'; // Ruta de tu JSON Server

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?email=${email}&password=${password}`);
  }

  setSessionActive() {
    localStorage.setItem('sessionActive', 'true');  // Cambia a sessionStorage si prefieres
  }

  // Método para verificar si la sesión está activa
  isSessionActive(): boolean {
    return localStorage.getItem('sessionActive') === 'true';
  }

  // Método para cerrar sesión
  logout() {
    localStorage.removeItem('sessionActive');
  }

}
