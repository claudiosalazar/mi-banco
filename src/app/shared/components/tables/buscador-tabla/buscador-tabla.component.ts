import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-buscador-tabla',
  templateUrl: './buscador-tabla.component.html'
})
export class BuscadorTablaComponent implements OnInit {

  @Output() datosFiltradosEvent = new EventEmitter<any[]>();
  @Input() tituloBuscador: string | undefined;

  id: any | undefined;
  paginatedData: any[] | undefined;
  valorBusqueda: any | undefined;
  campoBusqueda = new FormControl('');

  constructor() { }

  ngOnInit() {
  }

}
