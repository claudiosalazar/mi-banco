import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CartolasHistoricasService } from '../../../../core/services/cartolas-historicas.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cartola-historica',
  templateUrl: './cartola-historica.component.html'
})
export class CartolaHistoricaComponent implements OnInit {

  @Output() datosOrdenados = new EventEmitter<void>();

  paginatedCartolas: any[] = [];
  cartolas: any[] = [];
  fechasEmision: any[] = [];

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

  fechaInicio: string = '';
  fechaTermino: string = '';

  // Variable para animacion de icono en th
  public isRotatedIn: boolean = false;
  public columnaSeleccionada: string = '';
  
  listaFechas = [];

  constructor(
    private cartolasHistoricasService: CartolasHistoricasService,
    private cdRef: ChangeDetectorRef,
  ) { };

  ngOnInit(): void {
    this.cartolasHistoricasService.getCartolasHistoricas().subscribe(data => {
      if (Array.isArray(data)) { // Comprueba si 'data' es un array
        this.cartolas = data; // Asigna 'data' a 'this.cartolas'
      } else {
        console.log('Los datos recibidos no son un array'); // Imprime un mensaje si 'data' no es un array
      }
      this.cdRef.detectChanges();
    });
  }


  // Anima icono de TH
  public onHeaderClick(): void {
    this.isRotatedIn = !this.isRotatedIn;
  }

  // Ordena los datos de la tabla
  ordenarDatos(column: any): void {
    this.columnaSeleccionada = column;
    if (this.sortedColumn === column) {
      this.sortOrder = this.sortOrder === 1 ? -1 : 1;
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortedColumn = column;
      this.sortAscending = true;
    }
    this.sortOrder = this.sortAscending ? 1 : -1;
    this.cartolas?.sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {
      return a[column] > b[column] ? this.sortOrder : a[column] < b[column] ? -this.sortOrder : 0;
    });
    
    this.cartolas?.sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {
      return a[column].localeCompare(b[column]) * this.sortOrder;
    });
  
    this.datosOrdenados.emit();
  }
}
