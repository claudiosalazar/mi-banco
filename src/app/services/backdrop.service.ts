import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackdropService {
  // BehaviorSubject que emite un valor cada vez que el estado del backdrop cambia
  private _mostrarBackdropCustomModal: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _mostrarBackdropOffcanvas: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  // Observable al que los componentes pueden suscribirse para saber cuándo cambia el estado del backdrop
  public get mostrarBackdropCustomModal$(): Observable<boolean> {
    return this._mostrarBackdropCustomModal.asObservable();
  }

  public get mostrarBackdropOffcanvas$(): Observable<boolean> {
    return this._mostrarBackdropOffcanvas.asObservable();
  }

  private observer: MutationObserver | undefined;
  
  constructor() { }

  public startObserving(): void {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const backdropModal = document.querySelector('.modal-backdrop.fade.show');
          if (backdropModal && backdropModal.parentNode) {
            backdropModal.parentNode.removeChild(backdropModal);
          }

          const backdropOffcanvas = document.querySelector('.offcanvas-backdrop.fade.show');
          if (backdropOffcanvas && backdropOffcanvas.parentNode) {
            backdropOffcanvas.parentNode.removeChild(backdropOffcanvas);
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

  // Muestra el backdrop modal.
  public showModalBackdrop(): void {
    this._mostrarBackdropCustomModal.next(true);
  }

  // Oculta el backdrop modal.
  public hideModalBackdrop(): void {
    this._mostrarBackdropCustomModal.next(false);
  }

  // Muestra el backdrop offcanvas.
  public showOffcanvasBackdrop(): void {
    this._mostrarBackdropOffcanvas.next(true);
  }

  // Oculta el backdrop offcanvas.
  public hideOffcanvasBackdrop(): void {
    this._mostrarBackdropOffcanvas.next(false);
  }
}