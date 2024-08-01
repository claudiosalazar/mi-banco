import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../../../../services/productos.service';
import { Productos } from '../../../../../models/productos.model';
import { TransaccionesService } from '../../../../../services/transacciones.service';
import { Transacciones } from '../../../../../models/transacciones.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-linea-credito',
  templateUrl: './linea-credito.component.html'
})
export class LineaCreditoComponent implements OnInit {

  transaccionesLineaCredito = '';

  productos: Productos[] = [];
  transacciones: Transacciones[] = [];

  transaccionesFiltradas: any[] = [];

  originalData: any[] = [];
  itemsPerPage = 5;
  currentPage = 1;
  paginatedData: any[] | undefined;
  totalPages: any;

  campoBusqueda = new FormControl('');
  mostrarPaginador: boolean | undefined;

  formularioPagoLineaDeCredito = false;
  comprobantePagoLineaDeCredito = false;
  movimientosLineaDeCredito = true;

  constructor(
    private productosService: ProductosService,
    private transaccionesService: TransaccionesService
  ) { }

  ngOnInit() {
    this.productosService.getSeguros().subscribe((productos: Productos[]) => {
      if (productos) {
        this.productos = productos;
      }
    });
  }

  handleDatosFiltrados(datosFiltrados: any[]) {
    this.transacciones = datosFiltrados;
    this.transacciones = [...this.transacciones];
    this.originalData = [...this.transacciones];
    this.totalPages = Math.ceil(this.transacciones.length / this.itemsPerPage);
  }


  mostrarPagoLineaDeCredito(): void {
    this.movimientosLineaDeCredito = false;
    this.formularioPagoLineaDeCredito = true;
    this.comprobantePagoLineaDeCredito = false;

    //this.urlBrowserService.navegarAPagoLineaDeCredito();
  }

}
