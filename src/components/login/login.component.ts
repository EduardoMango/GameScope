import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ModalService } from '../../services/modalService';
declare var bootstrap: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  @ViewChild('modal') modal!: ElementRef;

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    // Escucha el evento desde el servicio cuando se deba abrir el modal
    this.modalService.modalOpen$.subscribe(() => {
      this.openModal();
    });
  }

  openModal() {
    const modalElement = this.modal.nativeElement;
    const modalBootstrap = new bootstrap.Modal(modalElement);
    modalBootstrap.show();
  }
}
