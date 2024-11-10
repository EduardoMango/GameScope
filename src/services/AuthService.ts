

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from '../Model/Interfaces/User';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUsers = environment.apiUsers;

  constructor(private http: HttpClient) {}

  /**
   * Método de inicio de sesión que verifica las credenciales.
   * Si el usuario es válido y activo, lo guarda en localStorage y activa la sesión.
   * @param email Correo del usuario
   * @param password Contraseña del usuario
   * @returns Observable con el usuario autenticado o un error si las credenciales son incorrectas
   */
  login(email: string, password: string): Observable<User> {
    return this.http.get<User[]>(`${this.apiUsers}?email=${email}&password=${password}`).pipe(
      map((users) => {
        if (users.length > 0) {
          const user = users[0]; // Obtener el primer usuario coincidente

          if (!user.isActive) {
            throw new Error('Usuario dado de baja'); // Lanza un error si el usuario está inactivo
          }

          localStorage.setItem('currentUser', JSON.stringify(user)); // Guarda el usuario en localStorage
          this.setSessionActive(); // Marca la sesión como activa
          return user;
        }

        // Lanza un error si las credenciales no son válidas
        throw new Error('Credenciales incorrectas');
      })
    );
  }

  /**
   * Método para activar la sesión del usuario guardando un indicador en localStorage.
   */
  private setSessionActive(): void {
    localStorage.setItem('sessionActive', 'true'); // Guarda el indicador de sesión activa
  }

  /**
   * Verifica si la sesión está activa revisando el valor en localStorage.
   * @returns true si la sesión está activa, false en caso contrario
   */
  isSessionActive(): boolean {
    return localStorage.getItem('sessionActive') === 'true';
  }

  /**
   * Obtiene el usuario actual desde localStorage.
   * @returns El objeto `User` si hay un usuario guardado, o null si no hay ninguno
   */
  getCurrentUser(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) as User : null;
  }

  /**
   * Método para cerrar sesión, eliminando el usuario y el indicador de sesión activa de localStorage.
   */
  logout(): void {
    localStorage.removeItem('sessionActive'); // Elimina el indicador de sesión activa
    localStorage.removeItem('currentUser'); // Elimina el usuario guardado
  }
}



/*import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {User} from '../Model/Interfaces/User';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  apiUsers = environment.apiUsers;
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUsers}?email=${email}&password=${password}`).pipe(
      map((users) => {
        if (users.length > 0 ) {
          if (!users[0].isActive) {
            throw Error('Usuario dado de baja');
          }
          const user = users[0]; // Si hay coincidencia, obtén el primer usuario
          localStorage.setItem('currentUser', JSON.stringify(user)); // Almacena el usuario completo
          this.setSessionActive();
          return user;
        }
        throw Error('Credenciales incorrectas');
      })
    );
  }

  setSessionActive() {
    localStorage.setItem('sessionActive', 'true');  // Cambia a sessionStorage si prefieres
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
  }
}*/
