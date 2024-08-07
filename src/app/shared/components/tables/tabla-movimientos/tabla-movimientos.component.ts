import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { TransaccionesService } from '../../../../services/transacciones.service';
import { DatosFiltradosService } from '../../../../services/datosFiltrados.service';
import { CuentaCorriente } from '../../../../models/cuenta-corriente.model';
import { LineaCredito } from '../../../../models/linea-credito.model';
import { Visa } from '../../../../models/visa.model';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'mb-tabla-movimientos',
  templateUrl: './tabla-movimientos.component.html'
})
export class TablaMovimientosComponent implements OnInit {

  @Output() datosOrdenados = new EventEmitter<void>();
  @Input() mostrarPaginador: boolean | undefined;
  @Input() transProducto: 'ctaCte' | 'lineaCredito' | 'visa' | 'todos' | undefined;
  @Input() datos: any | undefined;
  @Input() mostrarColumnaDestinatario = false;
  @Input() mostrarColumnaRut = false;
  @Input() mostrarColumnaNombreProducto = false;
  @Input() mostrarColumnaMensaje = false;
  @Input() mostrarColumnaDetalle= true;
  @Input() mostrarColumnaAbono = true;
  @Input() mostrarColumnaSaldo = true;
  @Input() claseTabla: string = 'tabla-movimientos';

  transacciones: any[] = [];
  paginatedTransacciones: any[] = [];
  originalData: any[] = [];
  itemsPerPage = 5;
  currentPage = 1;
  paginatedData: any[] = [];
  totalPages: any;

  // Variables para ordenar datos de tabla
  sortOrder = 1;
  sortedColumn: any;
  sortAscending: boolean = true;

  // Variable para animacion de icono en th
  public isRotatedIn: boolean = false;
  public columnaSeleccionada: string | undefined;

  transaccionesFiltradas: any[] = [];

  constructor(
    private transaccionesService: TransaccionesService,
    private datosFiltradosService: DatosFiltradosService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(): void {
    this.datosFiltradosService.datosFiltrados$.subscribe(
      datosFiltrados => {
        this.transacciones = datosFiltrados;
        this.transacciones = [...this.transacciones];
        this.originalData = [...this.transacciones];
        this.cdr.detectChanges();
      }
    );

    this.datosFiltradosService.paginationData$.subscribe(
      paginationData => {
        this.itemsPerPage = paginationData.itemsPerPage;
        this.currentPage = paginationData.currentPage;
        this.cdr.detectChanges();
      }
    );

    if (this.transProducto === 'ctaCte') {
      this.transaccionesService.getTransCuentaCorriente().subscribe(
        (transacciones: CuentaCorriente[]) => {
          this.handleTransacciones(transacciones);
        },
        (error: any) => {
          console.error('Error en transaccionesService:', error);
        }
      );
    } else if (this.transProducto === 'lineaCredito') {
      this.transaccionesService.getTransLineaCredito().subscribe(
        (transacciones: LineaCredito[]) => {
          this.handleTransacciones(transacciones);
        },
        (error: any) => {
          console.error('Error en transaccionesService:', error);
        }
      );
    } else if (this.transProducto === 'visa') {
      this.transaccionesService.getTransVisa().subscribe(
        (transacciones: Visa[]) => {
          this.handleTransacciones(transacciones);
        },
        (error: any) => {
          console.error('Error en transaccionesService:', error);
        }
      );
    } else if (this.transProducto === 'todos') {
      forkJoin({
        ctaCteTransacciones: this.transaccionesService.getTransCuentaCorriente(),
        lineaCreditoTransacciones: this.transaccionesService.getTransLineaCredito(),
        visaTransacciones: this.transaccionesService.getTransVisa()
      }).pipe(
        map(({ ctaCteTransacciones, lineaCreditoTransacciones, visaTransacciones }) => {
          const todasTransacciones = [
            ...ctaCteTransacciones,
            ...lineaCreditoTransacciones,
            ...visaTransacciones
          ];
          return todasTransacciones.sort((a, b) => b.fecha.localeCompare(a.fecha));
        })
      ).subscribe(
        (todasTransacciones) => {
          this.handleTransacciones(todasTransacciones);
        },
        (error: any) => {
          console.error('Error en transaccionesService:', error);
        }
      );
    }
  }

  handleTransacciones(transacciones: any[]): void {
    if (transacciones) {
      this.transacciones = transacciones.filter(transaccion => transaccion);
      this.paginarTransacciones();
      this.cdr.detectChanges();
    }
  }

  public onHeaderClick(): void {
    this.isRotatedIn = !this.isRotatedIn;
  }

  handleDatosFiltrados(event: any) {
    this.transaccionesFiltradas = event;
  }

  // Ordena los datos de la tabla
  ordenarDatos(column: string): void {
    this.columnaSeleccionada = column;
    if (this.sortedColumn === column) {
      this.sortOrder = this.sortOrder === 1 ? -1 : 1;
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortedColumn = column;
      this.sortAscending = true;
    }
  
    this.sortOrder = this.sortAscending ? 1 : -1;
  
    this.transacciones?.sort((a: { [x: string]: number; }, b: { [x: string]: number; }) => {
      return a[column] > b[column] ? this.sortOrder : a[column] < b[column] ? -this.sortOrder : 0;
    });
    this.paginarTransacciones();
    this.datosOrdenados.emit();
    this.cdr.detectChanges();
  }

  // Paginación de transacciones
  paginarTransacciones(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedTransacciones = this.transacciones.slice(start, end);
    this.totalPages = Math.ceil(this.transacciones.length / this.itemsPerPage);
    this.cdr.detectChanges();
  }

  // Cambiar página
  cambiarPagina(pagina: number): void {
    this.currentPage = pagina;
    this.paginarTransacciones();
    this.cdr.detectChanges();
  }
}