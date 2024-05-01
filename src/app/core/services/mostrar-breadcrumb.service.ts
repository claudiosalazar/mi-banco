import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MostrarBreadcrumbService {

  private estado = new BehaviorSubject(false);
  estadoActual = this.estado.asObservable();

  cambiarEstado(estado: boolean) {
    this.estado.next(estado);
  }
}
