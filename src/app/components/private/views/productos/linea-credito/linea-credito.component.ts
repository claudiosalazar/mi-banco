import { Component, Inject, OnInit } from '@angular/core';
import { ProductosService } from '../../../../../services/productos.service';
import { Productos } from '../../../../../models/productos.model';
import { TransaccionesService } from 'src/app/services/transacciones.service';
import { LineaCredito } from '../../../../../models/linea-credito.model'
import { DatosFiltradosService } from '../../../../../services/datosFiltrados.service';

@Component({
  selector: 'mb-linea-credito',
  templateUrl: './linea-credito.component.html'
})
export class LineaCreditoComponent implements OnInit {

  transaccionesFiltradas: LineaCredito[] = [];
  transaccionMasReciente: LineaCredito | null = null;

  productos: Productos[] = [];
  formularioPagoLineaDeCredito = false;
  comprobantePagoLineaDeCredito = false;
  movimientosLineaDeCredito = true;
  
  // Variables para busqueda y tabla
  transaccionesLineaCre: string[] = [];
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

    this.transaccionesService.getTransLineaCredito().subscribe((transaccionesLineaCre: LineaCredito[]) => {
      if (transaccionesLineaCre) {
        this.fecha = transaccionesLineaCre.length > 0 ? transaccionesLineaCre[0].fecha : null;
        this.abono = transaccionesLineaCre.length > 0 ? transaccionesLineaCre[0].abono : null;
      }
      this.transaccionMasReciente = this.obtenerTransaccionMasRecienteConAbono();
    });
  }

  mostrarPagoLineaDeCredito(): void {
    this.movimientosLineaDeCredito = false;
    this.formularioPagoLineaDeCredito = true;
    this.comprobantePagoLineaDeCredito = false;
  }

  obtenerTransaccionMasRecienteConAbono(): LineaCredito | null {
    if (this.transaccionesFiltradas.length === 0) {
      return null;
    }
    return this.transaccionesFiltradas
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0];
  }

  // Maneja los datos filtrados
  handleDatosFiltrados(datosFiltrados: any[]) {
    // Filtrar las transacciones que tienen un valor definido para id_trans_linea_cre
    const datosFiltradosPorProducto = datosFiltrados.filter(transaccion => transaccion.id_trans_linea_cre !== undefined && transaccion.id_trans_linea_cre !== null);
    
    // Asignar las transacciones filtradas a transaccionesLineaCre
    this.transaccionesLineaCre = datosFiltradosPorProducto;
    
    // Guardar una copia de los datos originales
    this.originalData = [...this.transaccionesLineaCre];
    
    // Actualizar los datos filtrados en el servicio
    this.datosFiltradosService.actualizarDatosFiltrados(datosFiltradosPorProducto);
  }

  onCancelacionConfirmada() {
    this.movimientosLineaDeCredito = true;
    this.formularioPagoLineaDeCredito = false;
  }

}