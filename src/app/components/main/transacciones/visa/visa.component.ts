import { Component, OnInit } from '@angular/core';
import { DatosUsuarioService } from '../../../../services/datos-usuario.service';

@Component({
  selector: 'app-visa',
  templateUrl: './visa.component.html'
})
export class VisaComponent implements OnInit {
  datosUsuarioActual: any;
  visaSaldo: any;
  saldo: any;
  currentPage = 1;
  itemsPerPage = 5;
  pages: number[] = [];

  constructor(
    private datosUsuarioService: DatosUsuarioService
  ) { }

  ngOnInit(): void {
    this.datosUsuarioService.getDatosUsuario().subscribe(datos => {
      this.datosUsuarioActual = datos;
      this.saldo = parseFloat(this.datosUsuarioActual.datosUsuario.montosUsuario.visa.visaSaldo);
      for (let trans of this.datosUsuarioActual.datosUsuario.montosUsuario.visa.visaTrans) {
        this.saldo = this.saldo - trans.cargo + trans.abono;
        trans.saldoFinal = this.saldo;
      }
      this.datosUsuarioActual.datosUsuario.montosUsuario.visa.visaTrans.reverse();
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
    this.datosUsuarioActual.datosUsuario.montosUsuario.visa.visaTrans.sort((a: { fecha: string | number | Date; }, b: { fecha: string | number | Date; }) => {
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
    this.datosUsuarioActual.datosUsuario.montosUsuario.visa.visaTrans.sort((a: { detalle: number; }, b: { detalle: number; }) => {
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
  
    this.datosUsuarioActual.datosUsuario.montosUsuario.visa.visaTrans.sort((a: { [x: string]: number; }, b: { [x: string]: number; }) => {
      return a[column] > b[column] ? this.sortOrder : a[column] < b[column] ? -this.sortOrder : 0;
    });
  }

  // Funcion para animacion de icono en th
  isColumnRotated(column: string): boolean {
    return this.currentSortColumn === column && this.sortAscending;
  }

  getPaginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.datosUsuarioActual?.datosUsuario?.montosUsuario?.visa?.visaTrans.slice(startIndex, startIndex + this.itemsPerPage);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  
  nextPage() {
    if (this.currentPage < this.pages.length) {
      this.currentPage++;
    }
  }
  
  setPage(i: number) {
    this.currentPage = i + 1;
  }

  calculatePages() {
    const totalPages = Math.ceil((this.datosUsuarioActual?.datosUsuario?.montosUsuario?.visa?.visaTrans.length || 0) / this.itemsPerPage);
    this.pages = Array(totalPages).fill(0).map((x,i)=>i+1);
  }
}
