import { Component, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { SidebarUsuarioComponent } from '../components/sidebar-usuario/sidebar-usuario.component';
import { FooterComponent } from '../components/footer/footer.component';
import { LoginComponent } from '../components/login/login.component';
import {FormRegisterComponent} from '../components/form-register/form-register.component';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarUsuarioComponent,
    FooterComponent, LoginComponent, FormRegisterComponent,
    NgbModalModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent{

}
