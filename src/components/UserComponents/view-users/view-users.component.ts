import {Component} from '@angular/core';
import {UsersService} from '../../../services/Users.service';
import {FormsModule} from '@angular/forms';
import {UserDTO} from '../../../Model/Interfaces/User';
import {userTitle} from '../../../Model/enums/user-titles';
import {RouterModule} from '@angular/router';
import {AuthService} from '../../../services/AuthService';

@Component({
  selector: 'app-view-users',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './view-users.component.html',
  styleUrl: './view-users.component.css'
})
export class ViewUsersComponent {

  busqueda:string = '';
  resultados: boolean = true;
  loggedUser!: UserDTO | null;


  users: UserDTO[] = [];

  constructor(private findUsersService: UsersService,
              private authService: AuthService) {
    this.loggedUser = this.authService.getCurrentUser();
  }

  searchUser(username:string){

    this.findUsersService.getByUsername(username).subscribe({
      next: (response) => {
        const users: UserDTO[] = response._embedded.userDTOList;
        // Filtrar el usuario logueado
        this.users = users.filter(user => user.username !== this.loggedUser?.username);

        // Verificar si el usuario logueado es admin
        const isAdmin = this.authService.isAdmin();  // Suponiendo que esta función retorna un booleano

        if (!isAdmin) {
          // Si no es admin, eliminar los usuarios baneados
          this.users = this.users.filter(user => !user.isBanned);
        }


        if (this.users.length === 0) {
          this.resultados = false;
        }
      },
      error: (error) => {
        console.log(error);
      }
    })
    }

  protected readonly userTitle = userTitle;

  followUser(userID: number) {

   this.findUsersService.isFollowingUser(this.loggedUser!.id, userID).subscribe({
     next: (response) => {
       if (response) {
         alert("You are already following this user.");
         return;
       }
       else {
         this.findUsersService.followUnfollowUser(this.loggedUser!.id, userID).subscribe({
           next: () => {
             alert("User has been followed.");
             this.loggedUser!.followingCount += 1;
             this.authService.updateSessionUser(this.loggedUser!);
           },
           error: (e: Error) => {
             console.error("Error deleting user:", e.message);
           }
         });
       }
     },
     error: (error) => {
       console.error("Error connecting to server:", error.message);
     }
   })



  }


}
