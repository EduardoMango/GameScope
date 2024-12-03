import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VideojuegosService } from '../../../services/videojuegos.service';
import { Review } from '../../../Model/Interfaces/Review';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { Videogame } from '../../../Model/Interfaces/videogame';
import { AuthService } from '../../../services/AuthService';

@Component({
  selector: 'app-review-completa',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, RatingModule, CommonModule],
  templateUrl: './review-completa.component.html',
  styleUrls: ['./review-completa.component.css']
})
export class ReviewCompletaComponent implements OnInit {
  videojuego: Videogame | undefined;
  reviewSeleccionada: Review | null = null; // Variable para almacenar la reseña seleccionada

  constructor(
    private route: ActivatedRoute,
    private videojuegosService: VideojuegosService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('videogameId');
    if (id) {
      this.videojuegosService.getById(id).subscribe((data) => {
        this.videojuego = data;
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

  authService = inject(AuthService);
  vgservice = inject(VideojuegosService);
  videogame: Videogame | null = null;

  clearComment(field: string): void {
    if (confirm('Are you sure you want to delete this comment? This action is due to a violation of our community guidelines.')) {
      if (this.reviewSeleccionada && this.videogame) {
        // Limpia el comentario seleccionado
        (this.reviewSeleccionada as any)[field] = null;
  
        // Encuentra la reseña en el videojuego
        const reviewIndex = this.videogame.reviews.findIndex(
          (review: Review) => review.id === this.reviewSeleccionada?.id
        );
  
        if (reviewIndex !== -1) {
          // Actualiza la reseña en el array de reseñas
          this.videogame.reviews[reviewIndex] = { ...this.reviewSeleccionada };
  
          // Sincroniza los cambios con el servidor
          this.vgservice.put(this.videogame).subscribe({
            next: () => alert('The comment has been deleted for violating our community guidelines.'),
            error: (err: Error) => {
              console.error('Error deleting comment:', err);
              alert('Failed to delete the comment.');
            }
          });
        } else {
          alert('Review not found in videogame.');
        }
      }
    }
  } 

  eliminateReview(): void {
    if (confirm('Are you sure you want to delete this review?')) {
      if (this.reviewSeleccionada && this.reviewSeleccionada.id) {
        this.vgservice.deleteReview(this.reviewSeleccionada.id).subscribe({
          next: () => {
            alert('Review deleted successfully.');
            this.volverALista(); // Volver a la lista después de eliminar
          },
          error: (err: Error) => {
            console.error('Error deleting review:', err);
            alert('Failed to delete the review.');
          }
        });
      } else {
        alert('Review ID is missing or invalid.');
      }
    }
  }
}
