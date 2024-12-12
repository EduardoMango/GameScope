import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/AuthService';
import {User} from '../../../Model/Interfaces/User';
import {Videogame} from '../../../Model/Interfaces/videogame';
import {UsersService} from '../../../services/Users.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-user-library',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './user-library.component.html',
  styleUrl: './user-library.component.css'
})
export class UserLibraryComponent implements OnInit {

  user!: User | null;
  library: Videogame[] = [];
  constructor(private authService: AuthService,
              private userService: UsersService) {
    this.user= this.authService.getCurrentUser();
  }

  ngOnInit(): void {
      this.userService.getLibrary(this.user!.id).subscribe({
        next: (response) => {
          this.library = response._embedded?.videogameDTOList || [];
        },
        error: (error) => {
          console.log(error);
        }
      })

    }

  removeVideogame(videogame: Videogame) {
    const gameIndex = this.library.findIndex(game => game.id === videogame.id);

    this.library.splice(gameIndex, 1);

    this.userService.removeVideogameFromLibrary(this.user!.id, videogame.id).subscribe({
      next: () => {
        alert("Game removed from your library");
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
