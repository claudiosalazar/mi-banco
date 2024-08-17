import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DatosFiltradosService } from '../../../../../../services/datosFiltrados.service';
import { TransaccionesService } from '../../../../../../services/transacciones.service';
import { CuentaCorriente } from '../../../../../../models/cuenta-corriente.model';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html'
})
export class MovimientosComponent implements OnInit {

  transaccionesFiltradas: CuentaCorriente[] = [];
  transaccionMasReciente: CuentaCorriente | null = null;

  transaccionesCuentaCorriente: string[] = [];
  transacciones: any[] | undefined;
  productos: any[] = [];
  originalData: any[] = [];
  itemsPerPage = 5;
  currentPage = 1;
  paginatedData: any[] | undefined;
  totalPages: any;

  campoBusqueda = new FormControl('');
  mostrarPaginador: boolean | undefined;

  tablaConDatos: boolean = true;
  mostrarAlerta: boolean = false;

  constructor(
    private transaccionesService: TransaccionesService,
    @Inject(DatosFiltradosService) private datosFiltradosService: DatosFiltradosService
  ) { }

  ngOnInit() {
    this.transaccionesService.getTransCuentaCorriente().subscribe((transaccionesCuentaCorriente: CuentaCorriente[]) => {
      if (transaccionesCuentaCorriente) {
        this.transaccionesFiltradas = transaccionesCuentaCorriente;
        this.transaccionMasReciente = this.obtenerTransaccionMasRecienteConAbono();
      }
    });
  }

  obtenerTransaccionMasRecienteConAbono(): CuentaCorriente | null {
    if (this.transaccionesFiltradas.length === 0) {
      return null;
    }
    return this.transaccionesFiltradas
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0];
  }

  handleDatosFiltrados(datosFiltrados: any[]) {
    // Filtrar las transacciones que tienen un valor definido para id_trans_linea_cre
    const datosFiltradosPorProducto = datosFiltrados.filter(transaccion => transaccion.id_trans_cta_cte !== undefined && transaccion.id_trans_cta_cte !== null);
    
    // Asignar las transacciones filtradas a transaccionesLineaCre
    this.transaccionesCuentaCorriente = datosFiltradosPorProducto;
    
    // Guardar una copia de los datos originales
    this.originalData = [...this.transaccionesCuentaCorriente];
    
    // Actualizar los datos filtrados en el servicio
    this.datosFiltradosService.actualizarDatosFiltrados(datosFiltradosPorProducto);

    if (this.transaccionesCuentaCorriente.length === 0) {
      this.tablaConDatos = false;
      this.mostrarAlerta = true;
    } else {
      this.tablaConDatos = true;
      this.mostrarAlerta = false;
    }
  }
  

}
