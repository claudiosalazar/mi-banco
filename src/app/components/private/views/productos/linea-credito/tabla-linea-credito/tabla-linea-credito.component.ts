import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabla-linea-credito',
  templateUrl: './tabla-linea-credito.component.html'
})
export class TablaLineaCreditoComponent implements OnInit {

  transaccionesLineaCredito = '';
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
