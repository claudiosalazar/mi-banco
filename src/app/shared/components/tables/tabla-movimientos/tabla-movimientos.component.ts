import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { TransaccionesService } from '../../../../services/transacciones.service';
import { Transacciones } from '../../../../models/transacciones.model';

@Component({
  selector: 'mb-tabla-movimientos',
  templateUrl: './tabla-movimientos.component.html'
})
export class TablaMovimientosComponent implements OnInit {

  @Output() datosOrdenados = new EventEmitter<void>();
  @Input() mostrarPaginador: boolean | undefined;
  @Input() idProducto: number | undefined;
  @Input() datos: any | undefined;
  @Input() mostrarColumnaNombre: boolean | undefined;
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
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.transaccionesService.getTransacciones().subscribe((transacciones: Transacciones[]) => {
      if (transacciones) {
        this.transacciones = this.idProducto !== undefined 
          ? transacciones.filter(transaccion => transaccion.id_producto === this.idProducto)
          : transacciones;
        this.paginarTransacciones();
        this.cdr.detectChanges(); 
      }
    });
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