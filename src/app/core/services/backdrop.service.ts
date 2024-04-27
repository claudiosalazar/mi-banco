import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackdropService {
  // BehaviorSubject que emite un valor cada vez que el estado del backdrop cambia
  private _mostrarBackdropCustomModal: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  // Observable al que los componentes pueden suscribirse para saber cuándo cambia el estado del backdrop
  public get mostrarBackdropCustomModal$(): Observable<boolean> {
    return this._mostrarBackdropCustomModal.asObservable();
  }

  private observer: MutationObserver | undefined;
  
  constructor() { }

  /**
   * Inicia la observación de mutaciones en el cuerpo del documento.
   * Cada vez que se agrega o se elimina un nodo del cuerpo del documento,
   * verifica si hay un backdrop modal y, si lo hay, lo elimina.
   */
  public startObserving(): void {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const backdropModal = document.querySelector('.modal-backdrop.fade.show');
          if (backdropModal && backdropModal.parentNode) {
            backdropModal.parentNode.removeChild(backdropModal);
          }
        }
      });
    });

    this.observer.observe(document.body, { childList: true, subtree: true });
  }

  /**
   * Detiene la observación de mutaciones en el cuerpo del documento.
   */
  public stopObserving(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  /**
   * Muestra el backdrop.
   */
  public show(): void {
    this._mostrarBackdropCustomModal.next(true);
  }

  /**
   * Oculta el backdrop.
   */
  public hide(): void {
    this._mostrarBackdropCustomModal.next(false);
  }
}