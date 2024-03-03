import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms'

@Component({
  selector: 'app-cuenta-corriente',
  templateUrl: './cuenta-corriente.component.html'
})
export class CuentaCorrienteComponent implements OnInit {

  transaccionesCuentaCorriente = '0';
  
  // Captura datos de nodo desde cualquier ID
  transacciones: any[] | undefined;
  productos: any[] = [];
  originalData: any[] = [];
  itemsPerPage = 5;
  currentPage = 1;
  paginatedData: any[] | undefined;
  totalPages: any;

  // Variables para buscador
  campoBusqueda = new FormControl('');

  constructor() { }

  ngOnInit(): void {
  }

}