import { Component, EventEmitter, OnInit } from '@angular/core';
import { AgendaService } from '../../../../../../../services/agenda.service';
import { FormControl } from '@angular/forms';
import { of, switchMap } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-agenda-destinatarios',
  templateUrl: './agenda-destinatarios.component.html'
})
export class AgendaDestinatariosComponent implements OnInit {

  agenda: any[] = [];
  paginatedAgenda: any[] = [];
  public columnaSeleccionada: string | undefined;
  public isRotatedIn: boolean = false;
  // Variables para ordenar datos de tabla
  sortOrder = 1;
  sortedColumn: any;
  sortAscending: boolean = true;

  originalData: any[] = [];
  itemsPerPage = 5;
  currentPage = 1;
  paginatedData: any[] = [];
  totalPages: any;
  id: undefined;

  busquedaDestinatarios = new FormControl('');
  datosOrdenados = new EventEmitter<void>();

  constructor(
    private agendaService: AgendaService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadData();

    this.busquedaDestinatarios.valueChanges
    .pipe(
      switchMap(valorBusqueda => {
        if (valorBusqueda) {
          return this.agendaService.filtrarAgenda(valorBusqueda);
        } else {
          // Resetear a los datos originales y la página a 1
          this.currentPage = 1;
          this.agenda = [...this.originalData];
          this.paginarAgenda();
          this.cdr.detectChanges();
          return of(this.originalData);
        }
      })
    )
    .subscribe(datosFiltrados => {
      this.agenda = datosFiltrados;
      this.totalPages = this.agenda ? Math.ceil(this.agenda.length / this.itemsPerPage) : 0;
      this.paginarAgenda();
      this.cdr.detectChanges();
    });
  }

  loadData(): void {
    this.agendaService.getAgenda().subscribe((agenda: any) => {
      this.agenda = agenda;
      this.originalData = [...this.agenda];
      this.paginarAgenda();
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
  
    this.agenda?.sort((a: { [x: string]: number; }, b: { [x: string]: number; }) => {
      return a[column] > b[column] ? this.sortOrder : a[column] < b[column] ? -this.sortOrder : 0;
    });
    this.paginarAgenda();
    this.datosOrdenados.emit();
    this.cdr.detectChanges();
  }

  paginarAgenda(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedAgenda = this.agenda.slice(start, end);
    this.totalPages = Math.ceil(this.agenda.length / this.itemsPerPage);
    this.cdr.detectChanges();
  }

  handleDatosFiltrados(datosFiltrados: any[]) {
    const datosFiltradosPorProducto = datosFiltrados.filter(transaccion => transaccion.id_producto === 1);
    this.agenda = datosFiltradosPorProducto;
    this.originalData = [...this.agenda];
    this.agendaService.actualizarDatosFiltrados(datosFiltradosPorProducto);
  }

}