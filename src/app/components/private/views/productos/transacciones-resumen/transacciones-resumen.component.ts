import { Component, Inject, OnInit } from '@angular/core';
import { ProductosService } from '../../../../../services/productos.service';
import { Productos } from '../../../../../models/productos.model';
import { TransaccionesService } from '../../../../../services/transacciones.service';
import { Transacciones } from '../../../../../models/transacciones.model';
import { DatosFiltradosService } from '../../../../../services/datosFiltrados.service';

@Component({
  selector: 'app-transacciones-resumen',
  templateUrl: './transacciones-resumen.component.html'
})
export class TransaccionesResumenComponent implements OnInit {

  productos: Productos[] = [];
  transacciones: Transacciones[] = [];
  transaccionesFiltradas: Transacciones[] = [];
  transaccionMasReciente: Transacciones | null = null;
  mostrarPaginador: boolean | undefined;
  originalData: any[] = [];
  itemsPerPage = 5;
  currentPage = 1;
  paginatedData: any[] | undefined;
  totalPages: any;
  

  constructor(
    private productosService: ProductosService,
    private transaccionesService: TransaccionesService,
    @Inject(DatosFiltradosService) private datosFiltradosService: DatosFiltradosService
  ) { }

  ngOnInit() {
    this.productosService.getProductos().subscribe((productos: Productos[]) => {
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

  getTransaccionesCtaCte() {
    return this.transacciones.filter(transaccion => transaccion.id_producto === 0);
  }
  
  getTransaccionesLineaCredito() {
    return this.transacciones.filter(transaccion => transaccion.id_producto === 1);
  }
  
  getTransaccionesVisa() {
    return this.transacciones.filter(transaccion => transaccion.id_producto === 2);
  }

  // Maneja los datos filtrados
  handleDatosFiltrados(datosFiltrados: any[]) {
    const datosFiltradosPorProducto = datosFiltrados;
    this.transacciones = datosFiltradosPorProducto;
    this.originalData = [...this.transacciones];
    this.datosFiltradosService.actualizarDatosFiltrados(datosFiltradosPorProducto);
  }

}
