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

    this.transaccionesService.getTransVisa(idUserNumber).subscribe((transaccionesVisa: Visa[]) => {
      if (transaccionesVisa) {
        this.fecha = transaccionesVisa.length > 0 ? transaccionesVisa[0].fecha : null;
      }
    });

    this.obtenerTransaccionMasRecienteConAbono((ultimoAbono) => {
      if (ultimoAbono) {
        this.abono = ultimoAbono.abono;
      }
    });
  }

  obtenerTransaccionMasRecienteConAbono(callback: (ultimoAbono: Visa | null) => void): void {
    const idUser = localStorage.getItem('id_user');
    const idUserNumber = idUser ? parseInt(idUser) : 0; 
    let ultimoAbono: Visa | null = null;

    this.transaccionesService.getTransVisa(idUserNumber).subscribe(transacciones => {
      const transaccionesConAbono = transacciones.filter(transaccion => transaccion.abono !== null && transaccion.abono !== undefined);

      if (transaccionesConAbono.length > 0) {
        ultimoAbono = transaccionesConAbono.reduce((max, transaccion) => {
          return (max === null || transaccion.id_trans_visa > max.id_trans_visa) ? transaccion : max;
        }, null as Visa | null);
      }

      callback(ultimoAbono);
    });
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

    if (this.transaccionesVisa.length === 0) {
      this.tablaConDatos = false;
      this.mostrarAlerta = true;
    } else {
      this.tablaConDatos = true;
      this.mostrarAlerta = false;
    }
  }

  onCancelacionConfirmada() {
    this.movimientosVisa = true;
    this.formularioPagoVisa = false;
  }
}