import { Routes } from '@angular/router';
import {LoginComponent} from '../components/login/login.component';
import {FormRegisterComponent} from '../components/form-register/form-register.component';
import {MainComponent} from '../components/main/main.component';
import {ViewUsersComponent} from '../components/view-users/view-users.component';
import {InfoUserComponent} from '../components/info-user/info-user.component';
import { UpdateUserComponent } from '../components/update-user/update-user.component';

export const routes: Routes = [
  { path: 'home', component: MainComponent },  // Componente inicial al ingresar a la aplicación
  { path: 'userProfile/:id', component: InfoUserComponent },
  { path: 'login', component: LoginComponent }, 
  { path: 'register', component: FormRegisterComponent },
  { path: 'findUsers', component: ViewUsersComponent },
  { path: 'update/:id', component: UpdateUserComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];


/*export const routes: Routes = [

  {
    path: 'home',
    component: MainComponent
  },
  { path: 'userProfile/:userId',
    component: InfoUserComponent
  },  // Ruta con parámetro para otro usuario
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: FormRegisterComponent
  },
  {
    path: 'findUsers',
    component: ViewUsersComponent
  },
  {
    path: 'update/:id',
    component: UpdateUserComponent
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];*/
