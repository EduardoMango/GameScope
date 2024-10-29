import {AfterViewInit, Component, HostListener} from '@angular/core';
import {AuthService} from '../../services/AuthService';
declare var bootstrap: any;

@Component({
  selector: 'app-sidebar-usuario',
  standalone: true,
  imports: [],
  templateUrl: './sidebar-usuario.component.html',
  styleUrl: './sidebar-usuario.component.css'
})
export class SidebarUsuarioComponent implements AfterViewInit{
  sidebarVisible = false; // Controla la visibilidad

  constructor(public authService: AuthService) {}

  ngAfterViewInit() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const mouseX = event.clientX;

    // Mostrar el sidebar si el mouse está en los primeros 30px de la pantalla
    if (mouseX < 30) {
      this.sidebarVisible = true;
    } else if (mouseX > 80) { // Ocultar el sidebar si el mouse se aleja
      this.sidebarVisible = false;
    }
  }
}
