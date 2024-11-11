import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Review } from '../../Model/Interfaces/Review'
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/AuthService';
import { User } from '../../Model/Interfaces/User';
import { UsersService } from '../../services/Users.service';
import {ActivatedRoute} from '@angular/router';
import {Videogame} from '../../Model/Interfaces/videogame';
import {VideojuegosService} from '../../services/videojuegos.service';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [ReactiveFormsModule, RatingModule, CommonModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent {

  authService = inject(AuthService);
  reviewForm: FormGroup;

  videogameID: string | null = null;
  videogame: Videogame | null = null;

  constructor(private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private usersService: UsersService,
              private videogameService: VideojuegosService) {
    this.videogameID = this.activatedRoute.snapshot.paramMap.get('videogameId');


    this.reviewForm = fb.group({
      titulo: ['', [Validators.required, Validators.minLength(10)]],
      contenido: ['', [Validators.minLength(50), Validators.maxLength(500)]],
      puntuacionGraficos: [null, [Validators.required]],
      comentarioGraficos: ['',[Validators.minLength(50), Validators.maxLength(500)]],
      puntuacionJugabilidad: [null, [Validators.required]],
      comentarioJugabilidad: ['',[Validators.minLength(50), Validators.maxLength(500)]],
      puntuacionPrecioCalidad: [null, [Validators.required]],
      comentarioPrecioCalidad: ['',[Validators.minLength(50), Validators.maxLength(500)]],

    })
  }

  onSubmit(){
    if(this.authService.isSessionActive()){
      const user = this.authService.getCurrentUser();
      if(!user?.reviews.find(review => review.videojuegoId === this.videogameID)){
        if(this.reviewForm.valid){
          const formValues= this.reviewForm.value
          const review: Review ={
            videojuegoId: this.videogameID!,
            usuarioId: this.getUserId(this.authService.getCurrentUser()!),
            titulo: formValues.titulo,
            puntuacionGraficos: formValues.puntuacionGraficos,
            comentarioGraficos: formValues.comentarioGraficos,
            puntuacionJugabilidad: formValues.puntuacionJugabilidad,
            comentarioJugabilidad: formValues.comentarioJugabilidad,
            puntuacionPrecioCalidad: formValues.puntuacionPrecioCalidad,
            comentarioPrecioCalidad: formValues.comentarioPrecioCalidad,
            calificacionGlobal: (formValues.puntuacionGraficos + formValues.puntuacionJugabilidad + formValues.puntuacionPrecioCalidad) / 3,
            contenido: formValues.contenido,
            fechaCreacion: new Date(),
            comentarios: []
          };

          user?.reviews.push(review);
          this.authService.updateSessionUser(user!);
          this.usersService.updateUser(user!).subscribe()

          this.videogameService.getById(this.videogameID!).subscribe({
            next: (retrieved) => {
              this.videogame = retrieved;
              retrieved.reviews.push(review);
              this.videogameService.put(retrieved);
              console.log(retrieved);
              alert('Review published successfully');
            },
            error: (e:Error)=>{
              alert("Failure to publish review" + e.message)
            }
          });
        }
      } else {
        alert('You have already published a review for this videogame');
      }

    }else {
      alert('You must be logged in to publish a review');
    }
  }

  get titleError(){
    const control = this.reviewForm.get('titulo');
    return control?.touched && control.invalid ? 'Minimum characters required' : null;
  }

  get contentError(){
    const control = this.reviewForm.get('contenido');
    return control?.touched;
  }

  getUserId(user: User): string{
      return user?.id;
  }
}

