import { AfterViewInit, Component, HostListener } from '@angular/core';
import { AuthService } from '../../services/AuthService';
import { RouterModule } from '@angular/router';
import { User } from '../../Model/Interfaces/User';
declare var bootstrap: any;

@Component({
  selector: 'app-sidebar-usuario',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar-usuario.component.html',
  styleUrls: ['./sidebar-usuario.component.css']
})
export class SidebarUsuarioComponent implements AfterViewInit {
  sidebarVisible = false; // Controla la visibilidad
  user: User | null = null;

  constructor(public authService: AuthService) {
    // Obtiene el usuario logueado al iniciar el componente
    this.user = this.authService.getCurrentUser();
  }

  ngAfterViewInit() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
    console.log(this.user); // Verifica si el usuario logueado se ha cargado correctamente
  }

  // Muestra u oculta el sidebar dependiendo de la posición del mouse
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const mouseX = event.clientX;
    console.log('Mouse position:', mouseX);
    if (mouseX < 30) {
      this.sidebarVisible = true;
    } else if (mouseX > 80) {
      this.sidebarVisible = false;
    }
  }
}
