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

  cartolas: Cartolas[] = [];
  paginatedCartola: Cartolas[] = [];

  // Variables para ordenar datos de tabla
  sortOrder = 1;
  sortedColumn: any;
  sortAscending: boolean = true;

  originalData: Cartolas[] = [];
  itemsPerPage: number = 10; // Asigna un valor por defecto
  currentPage = 1;
  paginatedData: Cartolas[] = [];
  totalPages: number = 0;
  id_cartola: number | undefined;

  constructor(
    private cartolasService: CartolasService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(): void {
    const id_user = Number(localStorage.getItem('id_user')); // Convertir el valor de id_user a número
  
    if (id_user) {
      this.cartolasService.getCartolas(id_user).subscribe({
        next: (cartolas: Cartolas[]) => {
          this.cartolas = cartolas; // Asigna los datos recibidos a la variable cartolas
          this.originalData = [...this.cartolas];
          this.paginaCartola();
          this.cdr.detectChanges();
          // console.log('CartolaHistoricaComponent inicializado', this.cartolas); // Mover aquí el // console.log
        },
        error: (error) => {
          console.error('Error al obtener las cartolas', error);
        }
      });
    } else {
      console.error('id_user no encontrado en localStorage');
    }
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
  
    this.cartolas.sort((a: any, b: any) => {
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