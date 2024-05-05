import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.component.html'
})
export class AlertasComponent implements OnInit {

  @Input() tipoAlerta: any | undefined;
  @Input() mensajeTitulo: string | undefined;
  @Input() mensajeDestacado: string | undefined;
  @Input() mensajeInfo: string | undefined;
  @Input() icono: boolean | undefined;
  @Input() textoBoton: string | undefined;
  @Input() boton: boolean | undefined;
  @Input() tipoBoton: any | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
