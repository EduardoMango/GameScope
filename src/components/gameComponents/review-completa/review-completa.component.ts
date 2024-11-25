import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VideojuegosService } from '../../../services/videojuegos.service';
import { Review, Comment } from '../../../Model/Interfaces/Review';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { Videogame } from '../../../Model/Interfaces/videogame';
import { User } from '../../../Model/Interfaces/User';
import { AuthService } from '../../../services/AuthService';
import { UsersService } from '../../../services/Users.service';

@Component({
  selector: 'app-review-completa',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, RatingModule, CommonModule],
  templateUrl: './review-completa.component.html',
  styleUrls: ['./review-completa.component.css']
})
export class ReviewCompletaComponent implements OnInit {
  
  videojuego: Videogame | undefined;
 
  reviewSeleccionada: Review | any | null = null; // Variable para almacenar la reseña seleccionada
 
  idd : any = null;
 
  authService = inject(AuthService)

  usersService = inject (UsersService)

  vgservice = inject(VideojuegosService)

  
  constructor(
    private route: ActivatedRoute,
    private videojuegosService: VideojuegosService,
    private fb: FormBuilder
  ) {}
  
  comentarioForm!: FormGroup;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('videogameId');
    if (id) {
      this.videojuegosService.getById(id).subscribe((data) => {
        this.videojuego = data;
      });
      
      const usuarioActual = this.authService.getCurrentUser();
      this.comentarioForm = this.fb.group({
        autor: [usuarioActual?.username || '', Validators.required],
        contenido: ['', [Validators.required, Validators.minLength(5)]],
      });
      
    }
  }

  // Método para seleccionar una reseña
  seleccionarReview(review: Review): void {
    this.reviewSeleccionada = review;
  }

  // Método para volver a la lista de reseñas
  volverALista(): void {
    this.reviewSeleccionada = null;
  }



/** COMENTARIOS */
addComent() {
  if (this.comentarioForm.invalid) return;

  const nuevoComentario: Comment = {
    ...this.comentarioForm.getRawValue(),
    fecha: new Date(),
  };

  if (this.reviewSeleccionada) {
    // Agregar el comentario a la reseña seleccionada
    this.reviewSeleccionada.comentarios = [
      ...(this.reviewSeleccionada.comentarios || []),
      nuevoComentario,
    ];

    // Actualizar el videojuego asociado
    if (this.videojuego) {
      const reviewIndex = this.videojuego.reviews.findIndex(
        (r) => r.id === this.reviewSeleccionada.id
      );
      if (reviewIndex !== -1) {
        this.videojuego.reviews[reviewIndex] = this.reviewSeleccionada;

        this.vgservice
          .updateVideogame(this.videojuego.id, this.videojuego)
          .subscribe({
            next: () => {
              console.log('Videojuego actualizado con el nuevo comentario');
            },
            error: (err) => {
              console.error('Error al actualizar el videojuego:', err);
            },
          });
      }
    }

    // Actualizar el usuario asociado
    const userId = this.reviewSeleccionada.autorId; // Ajusta esto según tu modelo
    if (userId) {
      this.usersService.findUserById(userId).subscribe((user: User) => {
        const userReviewIndex = user.reviews.findIndex(
          (r) => r.id === this.reviewSeleccionada.id
        );
        if (userReviewIndex !== -1) {
          user.reviews[userReviewIndex] = this.reviewSeleccionada;

          this.usersService.updateUser2(user.id, user).subscribe({
            next: () => {
              console.log('Usuario actualizado con el nuevo comentario');
            },
            error: (err) => {
              console.error('Error al actualizar el usuario:', err);
            },
          });
        }
      });
    }

    this.comentarioForm.reset();
  }
}


}
