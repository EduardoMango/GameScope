import { Component } from '@angular/core';
import {InfoUserComponent} from '../../components/info-user/info-user.component';
import {LogrosUserComponent} from '../../components/logros-user/logros-user.component';

@Component({
  selector: 'app-user-profile-page',
  standalone: true,
  imports: [
    InfoUserComponent,
    LogrosUserComponent
  ],
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.css'
})
export class UserProfilePageComponent {

}
