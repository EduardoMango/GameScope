import { Component, OnInit } from '@angular/core';
import { User } from '../../../Model/Interfaces/User';
import { FormsModule } from '@angular/forms';
import { AvatarsComponent } from '../avatars/avatars.component';
import { CommonModule } from '@angular/common';
import { Avatar } from '../../../Model/Interfaces/avatar.interface';
import { AuthService } from '../../../services/AuthService';
import { UsersService } from '../../../services/Users.service';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {userTitle} from '../../../Model/enums/user-titles';
import {LogrosUserComponent} from '../logros-user/logros-user.component';

@Component({
  selector: 'app-info-user',
  standalone: true,
  imports: [AvatarsComponent, CommonModule, FormsModule, RouterModule, LogrosUserComponent],
  templateUrl: './info-user.component.html',
  styleUrls: ['./info-user.component.css']
})
export class InfoUserComponent implements OnInit {
  user!: User;
  imageUrl: string = 'https://via.placeholder.com/150';
  showAvatars: boolean = false; // Para controlar si se muestran los avatares
  isCurrentUser: boolean = false;
  isFollowing: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit() {

    // Obtener el parámetro `userId` de la ruta si existe
    const userId = this.route.snapshot.paramMap.get('userId');

    this.isAdmin = this.authService.isAdmin();

    if (userId) {
      // Si `userId` está presente, cargar otro usuario
      this.userService.findUserById(userId).subscribe(
        (user) => {
          this.user = user;
          this.imageUrl = user.avatarUrl || this.imageUrl; // Actualiza la imagen después de asignar el usuario
          this.checkIfFollowing(userId)
        },
        (error) => {
          console.error('Error al cargar el usuario:', error);
          this.initializeDefaultUser(); // Llama al método para inicializar el usuario por defecto si falla
        }
      );
    }
    if(!userId) {
      // Si no hay `userId`, cargar el usuario actual
      this.user = this.authService.getCurrentUser() as User;
      console.log(this.user);
      this.isCurrentUser = true;

      if (!this.user) {
        this.initializeDefaultUser(); // Si no hay usuario actual, inicializa el usuario por defecto
      }

      this.imageUrl = this.user.avatarUrl;
    }
  }

  // Método para inicializar un usuario por defecto
  private initializeDefaultUser() {
    // Crea un usuario por defecto aquí
    this.user = {
      id: 'defaultId', // Cambia esto al ID que quieras asignar por defecto
      username: 'Usuario por Defecto', // Cambia esto al nombre de usuario por defecto
      avatarUrl: "https://via.placeholder.com/150",
      isAdmin: false,
      isActive: true,
      isBanned: false,
      titles: [userTitle.Newbie],
      currentTitle: userTitle.Newbie,
      achievements: [],
      reviews: [],
      followers: 0,
      following: [],
      karma: 0,
      password: 'defaultPassword', // Cambia esto a tu contraseña por defecto
      email: 'defaultEmail', // Cambia esto a tu correo por defecto
      notificaciones: [],
      library: [],
      uninterestedGamesID: []
    };
  }

  // Método para mostrar/ocultar los avatares
  toggleAvatarSelection() {
    this.showAvatars = !this.showAvatars;
  }

  // Método para seleccionar un avatar
  onAvatarSelected(avatar: Avatar) {
    this.imageUrl = avatar.url;
    localStorage.setItem('profileImage', avatar.url); // Guarda la imagen seleccionada
    this.user.avatarUrl = avatar.url;
    //this.userService.updateUser(this.user).subscribe();
    this.authService.updateSessionUser(this.user);
    this.showAvatars = false;
  }

  checkIfFollowing(userID: string) {
    const thisUser = this.authService.getCurrentUser();
    this.isFollowing = thisUser ? thisUser.following.includes(userID) : false;
  }

  followUser() {

  }

  unfollowUser() {

  }

  banUser() {

    if (confirm("Are you sure you want to delete this user for violating policies?")) {
      this.userService.banUser(this.user).subscribe({
        next: () => {
          alert("User has been blocked for violating policies.");
          console.log('User successfully deleted');
          this.router.navigate(['/home']);
        },
        error: (e: Error) => {
          console.error("Error deleting user:", e.message);
        }
      });
    }
  }

  deactivateAccount(){
    if (confirm("Are you sure you want to deactivate your account?")) {
      this.userService.deactivateUser(this.user.id).subscribe({
        next: () => {
          alert("User has been deactivated.");
          this.authService.logout();
          this.router.navigate(['/home']);
        },
        error: (e: Error) => {
          console.error("Error deleting user:", e.message);
        }
      });
    }
  }

  changeTitle(newTitle: userTitle ) {

  }


  protected readonly userTitle = userTitle;
}
