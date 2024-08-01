import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PesosPipe } from '../../../../shared/pipes/pesos.pipe';
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

  transacciones: any[] = [];
  productos: any[] = [];

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

  constructor(
    private pesosPipe: PesosPipe,
    private transaccionesService: TransaccionesService
  ) { }

  ngOnInit() {
    this.transaccionesService.getTransacciones().subscribe((transacciones: Transacciones[]) => {
      if (transacciones) {
        // Filtrar las transacciones por id_producto
        this.transacciones = this.idProducto !== undefined 
          ? transacciones.filter(transaccion => transaccion.id_producto === this.idProducto)
          : transacciones;
      }
    });
  }

  public onHeaderClick(): void {
    this.isRotatedIn = !this.isRotatedIn;
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
    this.datosOrdenados.emit();
  }

}
