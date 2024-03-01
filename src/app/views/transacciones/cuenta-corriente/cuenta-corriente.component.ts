interface Producto {
   id: string;
   transacciones: any[];
}
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms'
import { ProductosUsuarioService } from 'src/app/core/services/productos-usuario.service';
import { ProductosUsuario } from 'src/app/shared/models/productos-usuario.model';

@Component({
  selector: 'app-cuenta-corriente',
  templateUrl: './cuenta-corriente.component.html'
})
export class CuentaCorrienteComponent implements OnInit {
  
  transacciones: any[] | undefined;
  itemsPerPage = 5;
  currentPage = 1;
  paginatedData: any[] | undefined;
  totalPages: any;

  // Variables para ordenar datos de tabla
  sortOrder = 1;
  sortedColumn = '';
  sortAscending: boolean = true;

  // Variable para animar icono en th
  rotatedState: boolean = true;




  //datosUsuarioActual: any;
  // saldoCtaCte: any;
  // saldo: any;
  // 
  
  // 
  // datosOriginales: DatosUsuarioActual['datosUsuario']['montosUsuario']['ctaCte']['transacciones'][] = [];

  // Tus datos actuales que se mostrarán en la tabla
  // datosActuales: DatosUsuarioActual['datosUsuario']['montosUsuario']['ctaCte']['transacciones'][] = [];

  // FormControl para el campo de búsqueda
  campoBusqueda = new FormControl('');

  constructor(
    private productosUsuarioService: ProductosUsuarioService
  ) { }

  

  ngOnInit(): void {
    const id = '0'; // Reemplaza '0' con el ID que deseas obtener
    this.productosUsuarioService.getProductosUsuarioTable().subscribe((productosUsuario: ProductosUsuario) => {
    const productos = productosUsuario.productos;
      const producto = productos.find(producto => producto.id === id);
      if (producto) {
        // Imprime los datos en la tabla, solo los primeros 5
        this.transacciones = producto.transacciones;
        this.transacciones.sort((a, b) => {
          const dateA = new Date(a.fecha);
          const dateB = new Date(b.fecha);
          return dateB.getTime() - dateA.getTime();
        });
        this.totalPages = Math.ceil(this.transacciones.length / this.itemsPerPage);
        this.paginacionDatos();
      } else {
        console.error('ID no encontrado');
      }
    }, error => {
      console.error('Error al obtener los datos del producto:', error);
    });
  }

  // Ordena los datos de la tabla
  ordenarDatos(column: string): void {
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
    this.paginacionDatos();
  }

  animaIcono(column: string): boolean {
    return this.sortedColumn === column && this.sortAscending;
  }

  // Functions para paginados
  paginacionDatos(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedData = this.transacciones ? this.transacciones.slice(start, end) : [];
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginacionDatos();
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginacionDatos();
    }
  }
  
  setPage(page: number): void {
    this.currentPage = page;
    this.paginacionDatos();
  }
  
  
  
  
  /*
  ngOnInit(): void {
    this.datosUsuarioService.getDatosUsuario().subscribe(datos => {
      this.datosUsuarioActual = datos;
      this.datosOriginales = this.datosUsuarioActual.datosUsuario.montosUsuario.ctaCte.transacciones;
      // Inicialmente, los datos actuales son todos los datos
      this.datosActuales = this.datosOriginales;
      this.saldo = parseFloat(this.datosUsuarioActual.datosUsuario.montosUsuario.ctaCte.saldo);
      for (let trans of this.datosOriginales) {
        this.saldo = this.saldo - trans.cargo + trans.abono;
        trans.saldo = this.saldo;
      }
      this.campoBusqueda.valueChanges.subscribe(textoBusqueda => {
        if (textoBusqueda) {
          // Filtrar los datos basándose en el texto de búsqueda
          this.datosActuales = this.datosOriginales.filter(trans => trans.detalle.toLowerCase().includes(textoBusqueda.toLowerCase()));
        } else {
          // Si no hay texto de búsqueda, mostrar todos los datos
          this.datosActuales = this.datosOriginales;
        }
      });
      this.datosActuales = this.datosOriginales;
      this.datosUsuarioActual.datosUsuario.montosUsuario.ctaCte.transacciones.reverse();
      this.calculatePages();
      console.log(this.datosUsuarioActual);
    }, error => {
      console.error('Error obteniendo los datos: ', error);
    });
  }

  sortOrder = -1;
  sortOrderDetalle = 1;
  currentColumn: string | undefined;
  currentSortColumn: string = '';
  sortAscending: boolean = true;

  sortTableFecha(): void {
    this.sortOrder = -this.sortOrder;
    this.datosUsuarioActual.datosUsuario.montosUsuario.ctaCte.transacciones.sort((a: { fecha: string | number | Date; }, b: { fecha: string | number | Date; }) => {
      let dateA = new Date(a.fecha);
      let dateB = new Date(b.fecha);
      return dateA > dateB ? this.sortOrder : dateA < dateB ? -this.sortOrder : 0;
    });
    if (this.currentSortColumn === 'fecha') {
      this.sortAscending = !this.sortAscending;
    } else {
      this.currentSortColumn = 'fecha';
      this.sortAscending = true;
    }
  }

  sortTableDetalle(): void {
    this.sortOrderDetalle = -this.sortOrderDetalle;
    this.datosUsuarioActual.datosUsuario.montosUsuario.ctaCte.transacciones.sort((a: { detalle: number; }, b: { detalle: number; }) => {
      return a.detalle > b.detalle ? this.sortOrderDetalle : a.detalle < b.detalle ? -this.sortOrderDetalle : 0;
    });
    if (this.currentSortColumn === 'detalle') {
      this.sortAscending = !this.sortAscending;
    } else {
      this.currentSortColumn = 'detalle';
      this.sortAscending = true;
    }
  }

  sortTableNumero(column: string): void {
    if (this.currentSortColumn === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.currentSortColumn = column;
      this.sortAscending = true;
    }
  
    this.sortOrder = this.sortAscending ? 1 : -1;
  
    this.datosUsuarioActual.datosUsuario.montosUsuario.ctaCte.transacciones.sort((a: { [x: string]: number; }, b: { [x: string]: number; }) => {
      return a[column] > b[column] ? this.sortOrder : a[column] < b[column] ? -this.sortOrder : 0;
    });
  }

  // Funcion para animacion de icono en th
  isColumnRotated(column: string): boolean {
    return this.currentSortColumn === column && this.sortAscending;
  }

  getPaginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = this.currentPage * this.itemsPerPage;
    return this.datosActuales.slice(start, end);
  }

  calculatePages() {
    const totalPages = Math.ceil((this.datosUsuarioActual?.datosUsuario?.montosUsuario?.ctaCte?.ctaCteTrans.length || 0) / this.itemsPerPage);
    this.pages = Array(totalPages).fill(0).map((x,i)=>i+1);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  
  nextPage() {
    if (this.currentPage < this.paginas.length) {
      this.currentPage++;
    }
  }
  
  setPage(i: number) {
    this.currentPage = i + 1;
  }
  */

}