import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-paginador',
  templateUrl: './paginador.component.html'
})
export class PaginadorComponent implements OnInit {

  @Input() set datosPaginador(datos: any[]) {
    this._datosPaginador = datos;
    this.calculateTotalPages();
    this.paginacionDatos();
  }
  @Input() itemsPerPage: number = 0;
  @Input() currentPage: number = 0;
  @Input() displayedPages: number = 6;
  @Input() startPage: number = 1;
  @Input() datosOrdenados!: EventEmitter<void>;
  @Output() paginatedData = new EventEmitter<any[]>();

  private _datosPaginador: any[] = [];
  paginatedDataArray: any[] = [];

  // Variables para paginador
  totalPages: number | undefined;
  mostrarPaginador: boolean = true;

  constructor() { }

  ngOnInit(): void {
    this.calculateTotalPages();
    this.datosOrdenados.subscribe(() => {
      this.paginacionDatos();
    });
  }

  paginacionDatos(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedDataArray = this._datosPaginador.slice(startIndex, endIndex);
    this.paginatedData.emit(this.paginatedDataArray);
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this._datosPaginador.length / this.itemsPerPage);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      if (this.currentPage < this.startPage) {
        this.startPage--;
      }
      this.paginacionDatos();
    }
  }
  
  nextPage(): void {
    if (this.totalPages && this.currentPage < this.totalPages) {
      this.currentPage++;
      if (this.currentPage > this.startPage + this.displayedPages - 1) {
        this.startPage++;
      }
      this.paginacionDatos();
    }
  }
  
  seleccionarPagina(page: number): void {
    this.currentPage = page;
    this.paginacionDatos();
  }

}
