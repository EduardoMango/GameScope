import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalOpenSource = new Subject<void>();
  modalOpen$ = this.modalOpenSource.asObservable();

  openModal() {
    this.modalOpenSource.next();
  }
}
