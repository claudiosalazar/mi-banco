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

  transaccionesCuentaCorriente: CuentaCorriente[] = [];
  transacciones: any[] | undefined;
  productos: any[] = [];
  originalData: any[] = [];
  itemsPerPage: any;
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
    this.loadData();
  }

  loadData(): void {
    const idUser = localStorage.getItem('id_user');
    const idUserNumber = idUser ? parseInt(idUser) : 0;
    this.transaccionesService.getTransCuentaCorriente(idUserNumber).subscribe(
      (data: CuentaCorriente[]) => {
        console.log('Datos cuenta corriente:', data);
        this.transacciones = data;
        this.originalData = [...data];
      },
      (error) => {
        console.error('Error al obtener la agenda:', error);
      }
    );
  }

  /*loadData() {
    const idUser = localStorage.getItem('id_user'); 
    if (idUser) {
      const idUserNumber = parseInt(idUser, 0);
      this.transaccionesService.getTransCuentaCorriente(idUserNumber).subscribe(
        (data: CuentaCorriente[]) => {
          console.log('Datos cuenta corriente:', data);
          this.transacciones = data;
          this.originalData = [...data]; // Guardar una copia de los datos originales
        },
        (error) => {
          console.error('Error al obtener la agenda:', error);
        }
      );
    } else {
      console.error('No se encontró id_user en el almacenamiento');
    }
  }

  obtenerTransaccionMasRecienteConAbono(): CuentaCorriente | null {
    if (this.transaccionesFiltradas.length === 0) {
      return null;
    }
    return this.transaccionesFiltradas
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0];
  }*/

  handleDatosFiltrados(datosFiltrados: any[]) {
    const datosFiltradosPorProducto = datosFiltrados.filter(transaccion => transaccion.id_trans_cta_cte !== undefined && transaccion.id_trans_cta_cte !== null);
    this.transaccionesCuentaCorriente = datosFiltradosPorProducto;
    this.originalData = [...this.transaccionesCuentaCorriente];
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