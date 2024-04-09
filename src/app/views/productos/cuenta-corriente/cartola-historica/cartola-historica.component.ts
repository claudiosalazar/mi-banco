import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CartolasHistoricasService } from '../../../../core/services/cartolas-historicas.service';

@Component({
  selector: 'app-cartola-historica',
  templateUrl: './cartola-historica.component.html'
})
export class CartolaHistoricaComponent implements OnInit {

  @Output() datosOrdenados = new EventEmitter<void>();

  paginatedCartolas: any[] = [];
  cartolas: any[] = [];

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
    private cartolasHistoricasService: CartolasHistoricasService,
    private cdRef: ChangeDetectorRef
  ) { };

  ngOnInit(): void {
    this.rangoFechas();
    this.setFechas();
    this.cartolasHistoricasService.getCartolasHistoricas().subscribe(data => {
      this.cartolas = data;
      this.totalPages = this.cartolas ? Math.ceil(this.cartolas.length / this.itemsPerPage) : 0;
      this.ordenarDatos('fechaEmision');
      this.cdRef.detectChanges();
    });
  }

  rangoFechas () {
    let fechaInicio: HTMLInputElement | null = document.getElementById('fechaInicio') as HTMLInputElement;
    let fechaTermino: HTMLInputElement | null = document.getElementById('fechaTermino') as HTMLInputElement;

    if (fechaInicio) {
      fechaInicio.addEventListener('change', (e) => {
        let fechaInicioVal: string = (e.target as HTMLInputElement).value;
        let fechaInicioSelected: HTMLElement | null = document.getElementById('fechaInicioSelected');
        if (fechaInicioSelected) {
          fechaInicioSelected.innerText = fechaInicioVal;
        }
      });
    }

    if (fechaTermino) {
      fechaTermino.addEventListener('change', (e) => {
        let fechaTerminoVal: string = (e.target as HTMLInputElement).value;
        let fechaTerminoSelected: HTMLElement | null = document.getElementById('fechaTerminoSelected');
        if (fechaTerminoSelected) {
          fechaTerminoSelected.innerText = fechaTerminoVal;
        }
      });
    }
  }

  setFechas() {
    let fechaInicio: HTMLInputElement | null = document.getElementById('fechaInicio') as HTMLInputElement;
    let fechaTermino: HTMLInputElement | null = document.getElementById('fechaTermino') as HTMLInputElement;
  
    let fechaActual = new Date();
    let fechaHace12Meses = new Date();
    fechaHace12Meses.setFullYear(fechaHace12Meses.getFullYear() - 1);
  
    if (fechaInicio) {
      fechaInicio.value = fechaActual.toISOString().slice(0,7);
    }
  
    if (fechaTermino) {
      fechaTermino.value = fechaHace12Meses.toISOString().slice(0,7);
    }
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
