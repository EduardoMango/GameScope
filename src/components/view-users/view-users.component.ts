import { Component } from '@angular/core';
import {UsersService} from '../../services/Users.service';
import {FormsModule} from '@angular/forms';
import {User} from '../../Model/Interfaces/User';
import {userTitle} from '../../Model/enums/user-titles';
import {NgOptimizedImage} from '@angular/common';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-view-users',
  standalone: true,
  imports: [FormsModule, NgOptimizedImage, RouterModule],
  templateUrl: './view-users.component.html',
  styleUrl: './view-users.component.css'
})
export class ViewUsersComponent {

  busqueda:string = '';
  resultados: boolean = true;

  users: User[] = [];

  constructor(private findUsersService: UsersService) {
  }

  searchUser(username:string){
    this.findUsersService.findUsersByName(username).subscribe({
      next: (users) => {
        this.users = users
        console.log(users)
        if (users.length == 0) {
          this.resultados = false
        }
      },
      error:(error) => {
          this.resultados = false
      }
    })
    }

  protected readonly userTitle = userTitle;
}
