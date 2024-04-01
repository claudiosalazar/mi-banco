import { Component, OnInit } from '@angular/core';
import { ProductosUsuarioService } from '../../../../../core/services/productos-usuario.service';

@Component({
  selector: 'app-ultimas-transferencias',
  templateUrl: './ultimas-transferencias.component.html'
})
export class UltimasTransferenciasComponent implements OnInit {

  transacciones: any[] = [];

  // Variables para paginador
  paginatedData: any[] | undefined;
  itemsPerPage: number = 5;
  currentPage: number = 1;
  totalPages: number | undefined;
  mostrarPaginador: boolean = true;
  
  // Variables para ordenar datos de tabla
  sortOrder = 1;
  sortedColumn = '';
  sortAscending: boolean = true;

  // Variable para animacion de icono en th
  public isRotatedIn: boolean = false;
  public columnaSeleccionada: string = '';

  constructor(
    private productosUsuarioService: ProductosUsuarioService
  ) { }

  ngOnInit (): void {
    this.getTransferencias();
  }

  // Anima icono de TH
  public onHeaderClick(): void {
    this.isRotatedIn = !this.isRotatedIn;
  }

  // Captura datos de transferencias del services
  getTransferencias(): void {
    this.productosUsuarioService.getTransferenciasCtaCte()
      .subscribe(datosFiltrados => {
        this.transacciones = datosFiltrados;
        this.transacciones.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        this.paginacionDatos();
      });
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
    this.paginacionDatos();
  }

  // Functions para paginados
  paginacionDatos(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = this.currentPage * this.itemsPerPage;
    this.paginatedData = this.transacciones ? this.transacciones.slice(startIndex, endIndex) : [];
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginacionDatos();
    }
  }
  
  nextPage(): void {
    if (this.totalPages && this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginacionDatos();
    }
  }
  
  seleccionarPagina(page: number): void {
    this.currentPage = page;
    this.paginacionDatos();
  }

}
