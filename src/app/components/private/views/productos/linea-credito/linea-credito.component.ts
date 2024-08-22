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

  productos: Productos[] = [];
  transaccionesFiltradas: LineaCredito[] = [];
  transaccionMasReciente: LineaCredito | null = null;
  formularioPagoLineaDeCredito = false;
  comprobantePagoLineaDeCredito = false;
  movimientosLineaDeCredito = true;
  
  // Variables para busqueda y tabla
  transaccionesLineaCre: string[] = [];
  mostrarPaginador: boolean | undefined;
  originalData: any[] = [];
  itemsPerPage: any;
  currentPage = 1;
  paginatedData: any[] | undefined;
  totalPages: any;
  
  abono: any;
  fecha: any;

  tablaConDatos: boolean = true;
  mostrarAlerta: boolean = false;
  
  constructor(
    private productosService: ProductosService,
    private transaccionesService: TransaccionesService,
    @Inject(DatosFiltradosService) private datosFiltradosService: DatosFiltradosService
  ) { }

  ngOnInit() {
    const idUser = localStorage.getItem('id_user');
    const idUserNumber = idUser ? parseInt(idUser) : 0;

    this.productosService.getProductos().subscribe((productos: Productos[]) => {
      if (productos) {
        this.productos = productos;
      }
    });

    this.transaccionesService.getTransLineaCredito(idUserNumber).subscribe((transaccionesLineaCre: LineaCredito[]) => {
      if (transaccionesLineaCre) {
        this.fecha = transaccionesLineaCre.length > 0 ? transaccionesLineaCre[0].fecha : null;
      }
    });

    this.obtenerTransaccionMasRecienteConAbono((ultimoAbono) => {
      if (ultimoAbono) {
        this.abono = ultimoAbono.abono;
      }
    });
  }

  obtenerTransaccionMasRecienteConAbono(callback: (ultimoAbono: LineaCredito | null) => void): void {
    const idUser = localStorage.getItem('id_user');
    const idUserNumber = idUser ? parseInt(idUser) : 0;
    let ultimoAbono: LineaCredito | null = null;

    this.transaccionesService.getTransLineaCredito(idUserNumber).subscribe(transacciones => {
      const transaccionesConAbono = transacciones.filter(transaccion => transaccion.abono !== null && transaccion.abono !== undefined);

      if (transaccionesConAbono.length > 0) {
        ultimoAbono = transaccionesConAbono.reduce((max, transaccion) => {
          return (max === null || transaccion.id_trans_linea_cre > max.id_trans_linea_cre) ? transaccion : max;
        }, null as LineaCredito | null);
      }

      callback(ultimoAbono);
    });
  }

  mostrarPagoLineaDeCredito(): void {
    this.movimientosLineaDeCredito = false;
    this.formularioPagoLineaDeCredito = true;
    this.comprobantePagoLineaDeCredito = false;
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

    if (this.transaccionesLineaCre.length === 0) {
      this.tablaConDatos = false;
      this.mostrarAlerta = true;
    } else {
      this.tablaConDatos = true;
      this.mostrarAlerta = false;
    }
  }

  onCancelacionConfirmada() {
    this.movimientosLineaDeCredito = true;
    this.formularioPagoLineaDeCredito = false;
  }

}