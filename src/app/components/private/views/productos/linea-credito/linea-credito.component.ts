import { Component, Inject, OnInit } from '@angular/core';
import { ProductosService } from '../../../../../services/productos.service';
import { Productos } from '../../../../../models/productos.model';
import { TransaccionesService } from 'src/app/services/transacciones.service';
import { Transacciones } from 'src/app/models/transacciones.model';
import { DatosFiltradosService } from '../../../../../services/datosFiltrados.service';

@Component({
  selector: 'mb-linea-credito',
  templateUrl: './linea-credito.component.html'
})
export class LineaCreditoComponent implements OnInit {

  productos: Productos[] = [];
  transaccionesFiltradas: Transacciones[] = [];
  transaccionMasReciente: Transacciones | null = null;
  formularioPagoLineaDeCredito = false;
  comprobantePagoLineaDeCredito = false;
  movimientosLineaDeCredito = true;
  
  // Variables para busqueda y tabla
  transaccionesLineaCredito = '';
  transacciones: any[] | undefined;
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
        this.transaccionesFiltradas = transacciones.filter(transaccion => 
          transaccion.id_producto === 1 && transaccion.abono != null
        );
        this.transaccionMasReciente = this.obtenerTransaccionMasRecienteConAbono();
      }
    });
  }

  obtenerTransaccionMasRecienteConAbono(): Transacciones | null {
    if (this.transaccionesFiltradas.length === 0) {
      return null;
    }
    return this.transaccionesFiltradas
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0];
  }

  mostrarPagoLineaDeCredito(): void {
    this.movimientosLineaDeCredito = false;
    this.formularioPagoLineaDeCredito = true;
    this.comprobantePagoLineaDeCredito = false;
  }

  // Maneja los datos filtrados
  handleDatosFiltrados(datosFiltrados: any[]) {
    const datosFiltradosPorProducto = datosFiltrados.filter(transaccion => transaccion.id_producto === 1);
    this.transacciones = datosFiltradosPorProducto;
    //this.productos = [...this.transacciones];
    this.originalData = [...this.transacciones];
    this.datosFiltradosService.actualizarDatosFiltrados(datosFiltradosPorProducto);
  }

}