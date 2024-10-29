import { Routes } from '@angular/router';
import {AppComponent} from './app.component';
import {LoginComponent} from '../components/login/login.component';
import {FormRegisterComponent} from '../components/form-register/form-register.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: FormRegisterComponent
  }
];
