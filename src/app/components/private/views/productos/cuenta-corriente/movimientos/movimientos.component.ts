import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DatosFiltradosService } from '../../../../../../services/datosFiltrados.service';
import { TransaccionesService } from '../../../../../../services/transacciones.service';
import { Transacciones } from '../../../../../../models/transacciones.model';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html'
})
export class MovimientosComponent implements OnInit {

  transaccionesFiltradas: Transacciones[] = [];
  transaccionMasReciente: Transacciones | null = null;

  transaccionesCuentaCorriente = '';
  transacciones: any[] | undefined;
  productos: any[] = [];
  originalData: any[] = [];
  itemsPerPage = 5;
  currentPage = 1;
  paginatedData: any[] | undefined;
  totalPages: any;

  campoBusqueda = new FormControl('');
  mostrarPaginador: boolean | undefined;

  constructor(
    private transaccionesService: TransaccionesService,
    @Inject(DatosFiltradosService) private datosFiltradosService: DatosFiltradosService
  ) { }

  ngOnInit() {
    this.transaccionesService.getTransacciones().subscribe((transacciones: Transacciones[]) => {
      if (transacciones) {
        this.transaccionesFiltradas = transacciones.filter(transaccion => 
          transaccion.id_producto === 0 && transaccion.abono != null
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

  handleDatosFiltrados(datosFiltrados: any[]) {
    const datosFiltradosPorProducto = datosFiltrados.filter(transaccion => transaccion.id_producto === 0);
    this.transacciones = datosFiltradosPorProducto;
    this.originalData = [...this.transacciones];
    this.datosFiltradosService.actualizarDatosFiltrados(datosFiltradosPorProducto);
  }

}
