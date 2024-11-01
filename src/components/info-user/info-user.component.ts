import { Component, OnInit } from '@angular/core';
import { User } from '../../Model/Interfaces/User';
import { FormsModule } from '@angular/forms';
import { AvatarsComponent } from '../avatars/avatars.component';
import { CommonModule } from '@angular/common';
import { Avatar } from '../../Model/Interfaces/avatar.interface';
import { AuthService } from '../../services/AuthService';
import { UsersService } from '../../services/Users.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {userTitle} from '../../Model/enums/user-titles';

@Component({
  selector: 'app-info-user',
  standalone: true,
  imports: [AvatarsComponent, CommonModule, FormsModule, RouterModule],
  templateUrl: './info-user.component.html',
  styleUrls: ['./info-user.component.css']
})
export class InfoUserComponent implements OnInit {
  user: User | null = null;
  imageUrl: string = 'https://via.placeholder.com/150';
  showAvatars: boolean = false; // Para controlar si se muestran los avatares

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Cargar imagen guardada en localStorage o usar imagen predeterminada
    const storedImage = localStorage.getItem('profileImage');
    this.imageUrl = storedImage ? storedImage : this.imageUrl;

    // Obtener el parámetro `userId` de la ruta si existe
    const userId = this.route.snapshot.paramMap.get('userId');

    if (userId) {
      // Si `userId` está presente, cargar otro usuario
      this.userService.findUserById(userId).subscribe(
        (user) => {
          this.user = user;
          this.imageUrl = user.img || this.imageUrl; // Actualiza la imagen después de asignar el usuario
        },
        (error) => {
          console.error('Error al cargar el usuario:', error);
          this.initializeDefaultUser(); // Llama al método para inicializar el usuario por defecto si falla
        }
      );
    } else {
      // Si no hay `userId`, cargar el usuario actual
      this.user = this.authService.getCurrentUser();
      if (!this.user) {
        this.initializeDefaultUser(); // Si no hay usuario actual, inicializa el usuario por defecto
      } else {
        this.imageUrl = this.user.img || this.imageUrl; // Usa una imagen de respaldo
      }
    }
  }

  // Método para inicializar un usuario por defecto
  private initializeDefaultUser() {
    // Crea un usuario por defecto aquí
    this.user = {
      id: 'defaultId', // Cambia esto al ID que quieras asignar por defecto
      username: 'Usuario por Defecto', // Cambia esto al nombre de usuario por defecto
      img: "https://via.placeholder.com/150",
      isAdmin: false,
      isActive: true,
      titles: [userTitle.Newbie],
      currentTitle: userTitle.Newbie,
      achievements: [],
      reviews: [],
      followers: 0,
      following: [],
      karma: 0,
      password: 'defaultPassword', // Cambia esto a tu contraseña por defecto
      email: 'defaultEmail', // Cambia esto a tu correo por defecto
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
    this.showAvatars = false;
  }

  // Método para seleccionar una imagen personalizada
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        this.imageUrl = imageUrl;
        localStorage.setItem('profileImage', imageUrl); // Guarda la imagen seleccionada
      };
      reader.readAsDataURL(file);
    }
  }
}
