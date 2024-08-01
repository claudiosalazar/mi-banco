import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../../../../services/productos.service';
import { Productos } from '../../../../../models/productos.model';
import { TransaccionesService } from '../../../../../services/transacciones.service';
import { Transacciones } from '../../../../../models/transacciones.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-visa',
  templateUrl: './visa.component.html'
})
export class VisaComponent implements OnInit {

  transaccionesVisa = '2';

  productos: Productos[] = [];
  transacciones: Transacciones[] = [];

  movimientosVisa = true;
  formularioPagoVisa = false;
  comprobantePagoVisa = false;

  originalData: any[] = [];
  itemsPerPage = 5;
  currentPage = 1;
  paginatedData: any[] | undefined;
  totalPages: any;

  campoBusqueda = new FormControl('');
  mostrarPaginador: boolean | undefined;

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

    this.transaccionesService.getTransacciones().subscribe((transacciones: Transacciones[]) => {
      if (transacciones) {
        this.transacciones = transacciones;
      }
    });
  }


  handleDatosFiltrados(datosFiltrados: any[]) {
    this.transacciones = datosFiltrados;
    //this.productos = [...this.transacciones];
    this.originalData = [...this.transacciones];
    this.totalPages = Math.ceil(this.transacciones.length / this.itemsPerPage);
  }

  mostrarPagoVisa(): void {
    this.movimientosVisa = false;
    this.formularioPagoVisa = true;
    this.comprobantePagoVisa = false;

    //this.urlBrowserService.navegarAPagoVisa();
  }
  

}
