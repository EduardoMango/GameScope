import {Component, OnInit} from '@angular/core';
import {Videogame} from '../../Model/Interfaces/videogame';
import {VideojuegosService} from '../../services/videojuegos.service';

@Component({
  selector: 'app-view-games',
  standalone: true,
  imports: [],
  templateUrl: './view-games.component.html',
  styleUrl: './view-games.component.css'
})
export class ViewGamesComponent implements OnInit {
  videojuegos: Videogame[] = [];
  constructor(private videojuegosService: VideojuegosService) {
  }

  ngOnInit() {
    this.videojuegosService.get();
    this.videojuegosService.videogames$.subscribe((videogames) => {
      this.videojuegos = videogames;
    });
  }

}
