import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';// Usando Bootstrap como ejemplo

@Injectable({
  providedIn: 'root',
})
export class ModalService {

  constructor(private modalService: NgbModal) {}

  // Método para abrir el modal
  openModal(content: any) {
    return this.modalService.open(content);
  }

  // Método para cerrar el modal
  closeModal(modalRef: any) {
    modalRef.close();
  }
}
