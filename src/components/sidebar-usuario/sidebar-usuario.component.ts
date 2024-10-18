import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-sidebar-usuario',
  standalone: true,
  imports: [],
  templateUrl: './sidebar-usuario.component.html',
  styleUrl: './sidebar-usuario.component.css'
})
export class SidebarUsuarioComponent {
  sidebarVisible = false; // Controla la visibilidad

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
