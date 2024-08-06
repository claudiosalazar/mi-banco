import { Component, Inject, OnInit } from '@angular/core';
import { ProductosService } from '../../../../../services/productos.service';
import { Productos } from '../../../../../models/productos.model';
import { TransaccionesService } from '../../../../../services/transacciones.service';
import { CuentaCorriente } from '../../../../../models/cuenta-corriente.model';
import { LineaCredito } from '../../../../../models/linea-credito.model';
import { Visa } from '../../../../../models/visa.model';
import { DatosFiltradosService } from '../../../../../services/datosFiltrados.service';

@Component({
  selector: 'app-transacciones-resumen',
  templateUrl: './transacciones-resumen.component.html'
})
export class TransaccionesResumenComponent implements OnInit {

  productos: Productos[] = [];
  transacciones: any[] = [];
  transaccionesFiltradas: any[] = [];
  transaccionMasReciente: any | null = null;
  transaccionesCtaCte: CuentaCorriente[] = [];
  transaccionesLineaCre: LineaCredito[] = [];
  transaccionesVisa: Visa[] = [];
  mostrarPaginador: boolean = true;
  originalData: any[] = [];
  itemsPerPage = 5;
  currentPage = 1;
  paginatedData: any[] | undefined;
  totalPages: any;

  saldo: number | null = null;
  saldoCtaCte: any;
  saldoLineaCredito: any;
  saldoVisa: any;

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

    this.transaccionesService.getTransCuentaCorriente().subscribe((transacciones: CuentaCorriente[] ) => {
      if (transacciones) {
        this.transacciones = [...this.transacciones, ...transacciones];
      }
    });
    
    this.transaccionesService.getTransLineaCredito().subscribe((transacciones: LineaCredito[]) => {
      if (transacciones) {
        this.transacciones = [...this.transacciones, ...transacciones];
      }
    });
    
    this.transaccionesService.getTransVisa().subscribe((transacciones: Visa[]) => {
      if (transacciones) {
        this.transacciones = [...this.transacciones, ...transacciones];
      }
    });

    // Valor para imprimir saldo en las card
    this.transaccionesService.getTransCuentaCorriente().subscribe((transaccionesCtaCte: CuentaCorriente[] ) => {
      if (transaccionesCtaCte) {
        this.saldoCtaCte = transaccionesCtaCte.length > 0 ? transaccionesCtaCte[0].saldo : null;
      }
    });

    this.transaccionesService.getTransLineaCredito().subscribe((transaccionesLineaCre: LineaCredito[] ) => {
      if (transaccionesLineaCre) {
        this.saldoLineaCredito = transaccionesLineaCre.length > 0 ? transaccionesLineaCre[0].saldo : null;
      }
    });

    this.transaccionesService.getTransVisa().subscribe((transaccionesVisa: Visa[] ) => {
      if (transaccionesVisa) {
        this.saldoVisa = transaccionesVisa.length > 0 ? transaccionesVisa[0].saldo : null;
      }
    });

  }

  // Maneja los datos filtrados
  handleDatosFiltrados(datosFiltrados: any[]) {
    this.transaccionesFiltradas = datosFiltrados; // Actualizar solo transaccionesFiltradas
    this.datosFiltradosService.actualizarDatosFiltrados(datosFiltrados);
  }
}