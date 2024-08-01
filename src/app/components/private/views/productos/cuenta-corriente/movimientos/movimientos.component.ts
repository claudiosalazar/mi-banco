import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html'
})
export class MovimientosComponent implements OnInit {

  transaccionesCuentaCorriente = '0';

  transacciones: any[] | undefined;
  productos: any[] = [];
  originalData: any[] = [];

  itemsPerPage = 5;
  currentPage = 1;
  paginatedData: any[] | undefined;
  totalPages: any;

  campoBusqueda = new FormControl('');
  mostrarPaginador: boolean | undefined;

  constructor() { }

  ngOnInit() {
  }

  handleDatosFiltrados(datosFiltrados: any[]) {
    this.transacciones = datosFiltrados;
    this.productos = [...this.transacciones];
    this.originalData = [...this.transacciones];
    this.totalPages = Math.ceil(this.transacciones.length / this.itemsPerPage);
  }

}
