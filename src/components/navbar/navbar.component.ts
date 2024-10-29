import {Component} from '@angular/core';
import { AuthService } from '../../services/AuthService';
import { LoginComponent } from '../login/login.component';
import { FormRegisterComponent } from '../form-register/form-register.component';
import {Router} from '@angular/router';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    FormRegisterComponent,
    LoginComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {


  constructor(public authService: AuthService, private router: Router) {}

  openRegister(){
    this.router.navigate(['register']);
  }

  openLogin(){
    this.router.navigate(['login']);
  }
  // Método para cerrar sesión
  onLogout() {
    this.authService.logout();  // Establece la sesión como inactiva
  }
}
