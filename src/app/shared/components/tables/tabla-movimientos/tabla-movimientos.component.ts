import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TransaccionesService } from '../../../../services/transacciones.service';
import { Transacciones } from '../../../../models/transacciones.model';

@Component({
  selector: 'app-tabla-movimientos',
  templateUrl: './tabla-movimientos.component.html'
})
export class TablaMovimientosComponent implements OnInit {

  @Output() datosOrdenados = new EventEmitter<void>();
  @Input() mostrarPaginador: boolean | undefined;
  @Input() nuevaClase: string | undefined;
  @Input() idProducto: number | undefined;
  @Input() datos: any | undefined;
  @Input() mostrarColumnaNombre: boolean | undefined; // Nuevo Input

  transacciones: any[] = [];

  paginatedTransacciones: any[] = [];

  originalData: any[] = [];
  itemsPerPage = 5;
  currentPage = 1;
  paginatedData: any[] | undefined;
  totalPages: any;

  // Variables para ordenar datos de tabla
  sortOrder = 1;
  sortedColumn = '';
  sortAscending: boolean = true;
  

  // Variable para animacion de icono en th
  public isRotatedIn: boolean = false;

  public columnaSeleccionada: string = '';

  transaccionesFiltradas: any[] = [];

  constructor(
    private transaccionesService: TransaccionesService
  ) { }

  ngOnInit() {
    this.transaccionesService.getTransacciones().subscribe((transacciones: Transacciones[]) => {
      if (transacciones) {
        this.transacciones = this.idProducto !== undefined 
          ? transacciones.filter(transaccion => transaccion.id_producto === this.idProducto)
          : transacciones;
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
  }

  // Paginación de transacciones
  paginarTransacciones(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedTransacciones = this.transacciones.slice(start, end);
    this.totalPages = Math.ceil(this.transacciones.length / this.itemsPerPage);
  }

  // Cambiar página
  cambiarPagina(pagina: number): void {
    this.currentPage = pagina;
    this.paginarTransacciones();
  }

}