import { Component, OnInit } from '@angular/core';
import { AgendaDestinatariosService } from '../../../../../core/services/agenda-destinatarios.service';

@Component({
  selector: 'app-agenda-destinatarios',
  templateUrl: './agenda-destinatarios.component.html'
})
export class AgendaDestinatariosComponent implements OnInit {

  destinatarios: any;
  

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
    private agendaService: AgendaDestinatariosService
  ) { }

  ngOnInit(): void {
    this.agendaService.getDestinatarios().subscribe(data => {
      this.destinatarios = data;
      this.totalPages = this.destinatarios && this.destinatarios.agenda ? Math.ceil(this.destinatarios.agenda.length / this.itemsPerPage) : 0;
      this.ordenarDatos('nombre');
      this.paginacionDatos();
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
  
    this.destinatarios?.agenda.sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {
      return a[column] > b[column] ? this.sortOrder : a[column] < b[column] ? -this.sortOrder : 0;
    });
  
    this.paginacionDatos();
  }

  // Functions para paginados
  paginacionDatos(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = this.currentPage * this.itemsPerPage;
    this.paginatedData = this.destinatarios ? this.destinatarios.agenda.slice(startIndex, endIndex) : [];
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
