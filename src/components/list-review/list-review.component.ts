import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { Review } from '../../Model/Interfaces/Review';
import { AuthService } from '../../services/AuthService';
import { UsersService } from '../../services/Users.service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VideojuegosService } from '../../services/videojuegos.service';
import { Videogame } from '../../Model/Interfaces/videogame';
import { FormsModule } from '@angular/forms';
import { Comment } from '../../Model/Interfaces/Comment';


@Component({
  selector: 'app-list-review',
  standalone: true,
  imports: [CommonModule, CardModule,RouterModule,FormsModule],
  templateUrl: './list-review.component.html',
  styleUrl: './list-review.component.css'
})

export class ListReviewComponent implements OnInit {
 ngOnInit(): void {
  if (this.authService.isAdmin()) {
    console.log('Is Admin:', true); // Solo muestra esto si es administrador
  }
  this.id = this.route.snapshot.paramMap.get('videogameId'); // Obtiene el ID de la ruta
  if (this.id) {
    this.getAllReviews(this.id);
  }
  }
   
  authService = inject(AuthService)
  usersService = inject (UsersService)
  vgservice = inject(VideojuegosService)
  route = inject(ActivatedRoute)

  constructor(private cdr: ChangeDetectorRef ,private router: Router ) {}

  reviewSeleccionada: Review | null = null; // Variable para almacenar la reseña seleccionada
  id: string | null = null;
  listReview: Review [] = [];

  addReviewToList(review: Review){
    this.listReview.push(review);
  }

 searchAllReviews(videojuego: Videogame) {
  // Verifica si el videojuego tiene reviews
  if (videojuego.reviews && videojuego.reviews.length > 0) {
    // Recorre cada review y agrégala a la lista de reviews
    videojuego.reviews.forEach(review => {
      this.addReviewToList(review);
    });
  } else {
    console.log("There are no reviews for this videogame");
  }
}

  getAllReviews(id: string){
    this.vgservice.getById(id).subscribe(
      {
        next: (users) => {
          const videojuego: Videogame = users;
          this.searchAllReviews(videojuego);
        }
      }
    )
  }

  sortReviews(event: Event) {
    const target = event.target as HTMLSelectElement | null; // Asegura que target no sea null
    const filter = target?.value; // Accede a value solo si target no es null
  
    switch (filter) {
      case 'fechaCreacion':
        console.log(this.listReview)
        //this.listReview.sort((a, b) => (b.fechaCreacion).toISOString (a.fechaCreacion).toISOString);
        this.listReview.sort((a, b) => a.titulo.localeCompare(b.titulo));
        console.log(this.listReview)
        this.cdr.detectChanges();
        break;
      case 'rating':
        console.log(this.listReview)
        this.listReview.sort((a, b) => (b.calificacionGlobal) - (a.calificacionGlobal)); // Maneja rating como un número y nullish coalescing
        console.log(this.listReview)
        this.cdr.detectChanges();
        
        break;
    }
  }

  seleccionarReview(review: Review): void {
    this.reviewSeleccionada = review;
  }

  /*eliminateReview(review: Review): void {
    if (confirm('Are you sure you want to delete this review?')) {
      this.vgservice.deleteReview(review.videojuegoId, review.id!).subscribe({
        next: () => {
          alert('Review successfully deleted for violating community guidelines.');
          // Update the local list of reviews
          this.listReview = this.listReview.filter((r) => r.id !== review.id);
        },
        error: (err) => {
          alert('Error deleting the review: ' + err.message);
        }
      });
    }
  }*/
} 