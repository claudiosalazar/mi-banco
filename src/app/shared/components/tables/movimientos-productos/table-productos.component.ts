import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ProductosUsuarioService } from '../../../../core/services/productos-usuario.service';
import { DatosFiltradosService } from '../../../../core/services/productos-usuario.service';
import { ProductosUsuario } from '../../../models/productos-usuario.model';

@Component({
  selector: 'app-tables',
  templateUrl: './table-productos.component.html'
})
export class TablesProductosComponent implements OnInit {

  @Output() datosOrdenados = new EventEmitter<void>();
  @Input() mostrarPaginador: boolean | undefined;
  @Input() nuevaClase: string | undefined;
  @Input() set id(id: string) {
    this._id = id;
    this.productosUsuarioService.actualizarIdActual(id);
  };

  paginatedTransacciones: any[] = [];

  get id(): string {
    return this._id;
  }
  private _id: any;
  
  // Captura datos de nodo desde cualquier ID
  transacciones: any[] = [];
  productos: any[] = [];
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
    private productosUsuarioService: ProductosUsuarioService,
    private datosFiltradosService: DatosFiltradosService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Camputa el ID definido en el componente padre
    this.loadData(this.id);
  }
  
  // Captura la informacion para tabla en base al ID
  loadData(id: string | undefined): void {
    this.datosFiltradosService.datosFiltrados$.subscribe(datosFiltrados => {
      // Actualizar la tabla con los datos filtrados
      this.transacciones = datosFiltrados;
      this.productos = [...this.transacciones];
      this.originalData = [...this.transacciones];
      this.cdRef.detectChanges();
    });

    this.datosFiltradosService.paginationData$.subscribe(paginationData => {
      this.itemsPerPage = paginationData.itemsPerPage;
      this.currentPage = paginationData.currentPage;
      this.cdRef.detectChanges();
    });

    this.productosUsuarioService.getProductosUsuarioTable().subscribe((productosUsuario: ProductosUsuario) => {
      const productos = productosUsuario.productos;
      const producto = productos.find(producto => producto.id === id);
      
      if (producto) {
        // Imprime los datos en la tabla, solo los primeros 5
        this.transacciones = producto.transacciones;
        this.productos = [...this.transacciones];
        this.originalData = [...this.transacciones];
        
        // Captura el saldo del producto
        this.productosUsuarioService.calculosMontos(productos);
  
        // Ordena la tabla por fecha
        this.transacciones.sort((a, b) => {
          const dateA = new Date(a.fecha);
          const dateB = new Date(b.fecha);
          return dateB.getTime() - dateA.getTime();
        });
        this.totalPages = Math.ceil(this.transacciones.length / this.itemsPerPage);
        this.mostrarPaginador = this.transacciones.length > 5;
      }
      this.cdRef.detectChanges();
    }, error => {
      console.error('Error al obtener los datos del producto:', error);
    });
  }

  // Anima icono de TH
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
