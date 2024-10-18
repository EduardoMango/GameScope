import { Component } from '@angular/core';
import { ModalService } from '../../services/modalService';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private modalService: ModalService) {}

  openLoginModal() {
    this.modalService.openModal(); // Llama al servicio para emitir el evento
  }

}
