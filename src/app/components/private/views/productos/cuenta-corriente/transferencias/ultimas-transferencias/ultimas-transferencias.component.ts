import { Component, Inject, OnInit } from '@angular/core';
import { TransaccionesService } from '../../../../../../../services/transacciones.service';
import { DatosFiltradosService } from '../../../../../../../services/datosFiltrados.service';
import { CuentaCorriente } from '../../../../../../../models/cuenta-corriente.model';

@Component({
  selector: 'app-ultimas-transferencias',
  templateUrl: './ultimas-transferencias.component.html'
})
export class UltimasTransferenciasComponent implements OnInit {

  transaccionesFiltradas: any[] = [];

  // Variables para busqueda y tabla
  mostrarPaginador: boolean | undefined;
  originalData: any[] = [];
  itemsPerPage = 5;
  currentPage = 1;
  paginatedData: any[] | undefined;
  totalPages: any;

  constructor(
    private transaccionesService: TransaccionesService,
    @Inject(DatosFiltradosService) private datosFiltradosService: DatosFiltradosService
  ) { }

  ngOnInit() {
    this.transaccionesService.getTransCuentaCorrienteTransferencia().subscribe((transaccionesFiltradas: any[]) => {
      if (transaccionesFiltradas) {
        console.log ('transaccionesCtaCte', transaccionesFiltradas);
        this.transaccionesFiltradas = transaccionesFiltradas;
        this.handleDatosFiltrados(transaccionesFiltradas);
      }
    });
  }

  

  handleDatosFiltrados(datosFiltrados: any[]): void {
    // Filtrar las transacciones que tienen un valor definido para id_destinatario
    const datosFiltradosPorProducto = datosFiltrados.filter(transaccion => 
      transaccion.id_destinatario !== undefined && 
      transaccion.id_destinatario !== null
    );
    
    // Actualizar los datos filtrados en el servicio
    this.datosFiltradosService.actualizarDatosFiltrados(datosFiltradosPorProducto);
  }
}