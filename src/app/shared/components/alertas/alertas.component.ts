import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'mb-alertas',
  templateUrl: './alertas.component.html'
})
export class AlertasComponent {

  @Input() tipoAlerta: any | undefined;
  @Input() mensajeTitulo: string | undefined;
  @Input() mensajeDestacado: string | undefined;
  @Input() mensajeInfo: string | undefined;
  @Input() icono: boolean | undefined;
  @Input() textoBoton: string | undefined;
  @Input() boton: boolean | undefined;
  @Input() tipoBoton: any | undefined;
  @Output() botonClick = new EventEmitter<void>();

  constructor() { }

  accionBoton() {
    this.botonClick.emit();
  }

}
