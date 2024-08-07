import { Component, Inject, OnInit } from '@angular/core';
import { ProductosService } from '../../../../../services/productos.service';
import { Productos } from '../../../../../models/productos.model';
import { TransaccionesService } from '../../../../../services/transacciones.service';
import { Visa } from '../../../../../models/visa.model';
import { DatosFiltradosService } from '../../../../../services/datosFiltrados.service';

@Component({
  selector: 'mb-visa',
  templateUrl: './visa.component.html'
})
export class VisaComponent implements OnInit {

  productos: Productos[] = [];
  transaccionesFiltradas: Visa[] = [];
  transaccionMasReciente: Visa | null = null;
  formularioPagoVisa = false;
  comprobantePagoVisa = false;
  movimientosVisa = true;

  // Variables para busqueda y tabla
  transaccionesVisa: string[] = [];
  transacciones: any[] | undefined;
  mostrarPaginador: boolean | undefined;
  originalData: any[] = [];
  itemsPerPage = 5;
  currentPage = 1;
  paginatedData: any[] | undefined;
  totalPages: any;

  abono: number | null = null;
  fecha: any;

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

    this.transaccionesService.getTransVisa().subscribe((transaccionesVisa: Visa[]) => {
      if (transaccionesVisa) {
        this.fecha = transaccionesVisa.length > 0 ? transaccionesVisa[0].fecha : null;
        this.abono = transaccionesVisa.length > 0 ? transaccionesVisa[0].abono : null;
      }
      this.transaccionMasReciente = this.obtenerTransaccionMasRecienteConAbono();
    });
  }

  obtenerTransaccionMasRecienteConAbono(): Visa | null {
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
    // Filtrar las transacciones que tienen un valor definido para id_trans_linea_cre
    const datosFiltradosPorProducto = datosFiltrados.filter(transaccion => transaccion.id_trans_visa !== undefined && transaccion.id_trans_visa !== null);
    
    // Asignar las transacciones filtradas a transaccionesLineaCre
    this.transaccionesVisa = datosFiltradosPorProducto;
    
    // Guardar una copia de los datos originales
    this.originalData = [...this.transaccionesVisa];
    
    // Actualizar los datos filtrados en el servicio
    this.datosFiltradosService.actualizarDatosFiltrados(datosFiltradosPorProducto);
  }

  onCancelacionConfirmada() {
    this.movimientosVisa = true;
    this.formularioPagoVisa = false;
  }
}