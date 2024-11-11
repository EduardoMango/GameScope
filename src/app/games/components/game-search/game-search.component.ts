import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IgdbService } from '../../../service/igdb-service.service';
import { Game } from '../../interface/game';
import { SearchResultsComponent } from '../search-results/search-results.component';

@Component({
  selector: 'app-game-search',
  standalone: true,
  imports: [ReactiveFormsModule, SearchResultsComponent],
  templateUrl: './game-search.component.html',
  styleUrls: ['./game-search.component.css']
})
export class GameSearchComponent {
  searchForm: FormGroup;
  games: Game[] = [];
  loading = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private igdbService: IgdbService) {
    this.searchForm = this.fb.group({
      query: ['']
    });
  }

  onSearch() {
    const query = this.searchForm.get('query')?.value;
    console.log("Iniciando búsqueda:", query);
    this.loading = true;
    this.error = null;
    this.igdbService.getGames(query).subscribe({
      next: (games) => {
        console.log("Juegos recibidos:", games);
        this.games = games;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los juegos';
        console.error(err);
        this.loading = false;
      },
    });
  }
}


