import { Component, inject, Input } from '@angular/core';
import { Game } from '../../interface/game';
import { GameService } from '../../../service/game.service';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent {
  @Input()
  games: Game[] = [];

  gameService = inject(GameService);

  postGame(game: Game) {
    this.gameService.postGame(game).subscribe(
      {
        next: () => {
          alert('Juego agregado.');
        },
        error: (e: Error) => {
          console.log(e.message);
        }
      }
    )
  }
}
