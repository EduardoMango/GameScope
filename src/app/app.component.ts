import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchResultsComponent } from './games/components/search-results/search-results.component';
import { GameSearchComponent } from './games/components/game-search/game-search.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SearchPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'GameScope';
}
