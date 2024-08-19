import { Component, OnInit, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { CartolasService } from '../../../../../../services/cartolas.service';
import { Cartolas } from '../../../../../../models/cartolas.model';

@Component({
  selector: 'app-cartola-historica',
  templateUrl: './cartola-historica.component.html'
})
export class CartolaHistoricaComponent implements OnInit {

  datosOrdenados = new EventEmitter<void>();

  public isRotatedIn: boolean = false;
  public columnaSeleccionada: string | undefined;

  cartolas: any[] = [];
  paginatedCartola: any[] = [];

  // Variables para ordenar datos de tabla
  sortOrder = 1;
  sortedColumn: any;
  sortAscending: boolean = true;

  originalData: any[] = [];
  itemsPerPage: any;
  currentPage = 1;
  paginatedData: any[] = [];
  totalPages: any;
  id: number | undefined;

  constructor(
    private cartolasService: CartolasService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(): void {
    this.cartolasService.getCartolas().subscribe((_cartolas: any) => {
      this.cartolas = _cartolas; // Asigna los datos recibidos a la variable cartolas
      this.originalData = [...this.cartolas];
      this.paginaCartola();
      this.cdr.detectChanges();
    });
  }

  public onHeaderClick(): void {
    this.isRotatedIn = !this.isRotatedIn;
    this.cdr.detectChanges();
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
  
    this.cartolas?.sort((a: { [x: string]: number; }, b: { [x: string]: number; }) => {
      return a[column] > b[column] ? this.sortOrder : a[column] < b[column] ? -this.sortOrder : 0;
    });
    this.paginaCartola();
    this.datosOrdenados.emit();
    this.cdr.detectChanges();
  }

  paginaCartola(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedCartola = this.cartolas.slice(start, end);
    this.totalPages = Math.ceil(this.cartolas.length / this.itemsPerPage);
    this.cdr.detectChanges();
  }

}