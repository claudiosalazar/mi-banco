import { Component, OnInit } from '@angular/core';
import { DatosUsuarioService } from '../../../../services/datos-usuario.service';

@Component({
  selector: 'app-linea-credito',
  templateUrl: './linea-credito.component.html'
})
export class LineaCreditoComponent implements OnInit {
  datosUsuarioActual: any;
  lineaCreSaldo: any;
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
      this.saldo = parseFloat(this.datosUsuarioActual.datosUsuario.montosUsuario.lineaCredito.lineaCreSaldo);
      for (let trans of this.datosUsuarioActual.datosUsuario.montosUsuario.lineaCredito.lineaCreTrans) {
        this.saldo = this.saldo - trans.cargo + trans.abono;
        trans.saldoFinal = this.saldo;
      }
      this.datosUsuarioActual.datosUsuario.montosUsuario.lineaCredito.lineaCreTrans.reverse();
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
    this.datosUsuarioActual.datosUsuario.montosUsuario.lineaCredito.lineaCreTrans.sort((a: { fecha: string | number | Date; }, b: { fecha: string | number | Date; }) => {
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
    this.datosUsuarioActual.datosUsuario.montosUsuario.lineaCredito.lineaCreTrans.sort((a: { detalle: number; }, b: { detalle: number; }) => {
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
  
    this.datosUsuarioActual.datosUsuario.montosUsuario.lineaCredito.lineaCreTrans.sort((a: { [x: string]: number; }, b: { [x: string]: number; }) => {
      return a[column] > b[column] ? this.sortOrder : a[column] < b[column] ? -this.sortOrder : 0;
    });
  }

  // Funcion para animacion de icono en th
  isColumnRotated(column: string): boolean {
    return this.currentSortColumn === column && this.sortAscending;
  }

  getPaginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.datosUsuarioActual?.datosUsuario?.montosUsuario?.lineaCredito?.lineaCreTrans.slice(startIndex, startIndex + this.itemsPerPage);
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
    const totalPages = Math.ceil((this.datosUsuarioActual?.datosUsuario?.montosUsuario?.lineaCredito?.lineaCreTrans.length || 0) / this.itemsPerPage);
    this.pages = Array(totalPages).fill(0).map((x,i)=>i+1);
  }
}
