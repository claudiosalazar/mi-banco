import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mb-tabla-visa',
  templateUrl: './tabla-visa.component.html'
})
export class TablaVisaComponent implements OnInit {

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
