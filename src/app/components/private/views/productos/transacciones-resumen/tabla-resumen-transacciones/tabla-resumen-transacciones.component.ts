import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mb-tabla-resumen-transacciones',
  templateUrl: './tabla-resumen-transacciones.component.html'
})
export class TablaResumenTransaccionesComponent implements OnInit {

  transaccionesVisa = '';
  mostrarPaginador: boolean | undefined;
  originalData: any[] = [];
  itemsPerPage = 5;
  currentPage = 1;
  paginatedData: any[] | undefined;
  totalPages: any;

  constructor() { }

  ngOnInit() {
  }

}
