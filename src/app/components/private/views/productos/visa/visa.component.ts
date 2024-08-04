import { Component, Inject, OnInit } from '@angular/core';
import { ProductosService } from '../../../../../services/productos.service';
import { Productos } from '../../../../../models/productos.model';
import { TransaccionesService } from '../../../../../services/transacciones.service';
import { Transacciones } from '../../../../../models/transacciones.model';
import { DatosFiltradosService } from '../../../../../services/datosFiltrados.service';

@Component({
  selector: 'mb-visa',
  templateUrl: './visa.component.html'
})
export class VisaComponent implements OnInit {

  productos: Productos[] = [];
  transaccionesFiltradas: Transacciones[] = [];
  transaccionMasReciente: Transacciones | null = null;
  formularioPagoVisa = false;
  comprobantePagoVisa = false;
  movimientosVisa = true;

  // Variables para busqueda y tabla
  transaccionesVisa = '';
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
          transaccion.id_producto === 2 && transaccion.abono != null
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

  mostrarPagoVisa(): void {
    this.movimientosVisa = false;
    this.formularioPagoVisa = true;
    this.comprobantePagoVisa = false;
  }

  // Maneja los datos filtrados
  handleDatosFiltrados(datosFiltrados: any[]) {
    const datosFiltradosPorProducto = datosFiltrados.filter(transaccion => transaccion.id_producto === 2);
    this.transacciones = datosFiltradosPorProducto;
    //this.productos = [...this.transacciones];
    this.originalData = [...this.transacciones];
    this.datosFiltradosService.actualizarDatosFiltrados(datosFiltradosPorProducto);
  }
}