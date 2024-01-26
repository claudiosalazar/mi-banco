import { Component, OnInit } from '@angular/core';
import { DatosUsuarioService } from '../../../../services/datos-usuario.service';

@Component({
  selector: 'app-cuenta-corriente',
  templateUrl: './cuenta-corriente.component.html'
})
export class CuentaCorrienteComponent implements OnInit {
  datosUsuarioActual: any;
  saldoCtaCte: any;
  saldo: any;

  constructor(
    private datosUsuarioService: DatosUsuarioService
  ) { }

  ngOnInit(): void {
    this.datosUsuarioService.getDatosUsuario().subscribe(datos => {
      this.datosUsuarioActual = datos;
      this.saldo = parseFloat(this.datosUsuarioActual.datosUsuario.montosUsuario.ctaCte.ctaCteSaldo);
      for (let trans of this.datosUsuarioActual.datosUsuario.montosUsuario.ctaCte.ctaCteTrans) {
        this.saldo = this.saldo - trans.cargo + trans.abono;
        trans.saldoFinal = this.saldo;
      }
      this.datosUsuarioActual.datosUsuario.montosUsuario.ctaCte.ctaCteTrans.reverse();
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
    this.datosUsuarioActual.datosUsuario.montosUsuario.ctaCte.ctaCteTrans.sort((a: { fecha: string | number | Date; }, b: { fecha: string | number | Date; }) => {
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
    this.datosUsuarioActual.datosUsuario.montosUsuario.ctaCte.ctaCteTrans.sort((a: { detalle: number; }, b: { detalle: number; }) => {
      return a.detalle > b.detalle ? this.sortOrderDetalle : a.detalle < b.detalle ? -this.sortOrderDetalle : 0;
    });
    if (this.currentSortColumn === 'detalle') {
      this.sortAscending = !this.sortAscending;
    } else {
      this.currentSortColumn = 'detalle';
      this.sortAscending = true;
    }
  }

  /* sortTableNumero(column: string): void {
    if (this.currentColumn === column) {
      this.sortOrder = -this.sortOrder;
    } else {
      this.sortOrder = -1;
      this.currentColumn = column;
    }
    this.datosUsuarioActual.datosUsuario.montosUsuario.ctaCte.ctaCteTrans.sort((a: { [x: string]: number; }, b: { [x: string]: number; }) => {
      return a[column] > b[column] ? this.sortOrder : a[column] < b[column] ? -this.sortOrder : 0;
    });
  } */

  sortTableNumero(column: string): void {
    if (this.currentSortColumn === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.currentSortColumn = column;
      this.sortAscending = true;
    }
  
    this.sortOrder = this.sortAscending ? 1 : -1;
  
    this.datosUsuarioActual.datosUsuario.montosUsuario.ctaCte.ctaCteTrans.sort((a: { [x: string]: number; }, b: { [x: string]: number; }) => {
      return a[column] > b[column] ? this.sortOrder : a[column] < b[column] ? -this.sortOrder : 0;
    });
  }

  isColumnRotated(column: string): boolean {
    return this.currentSortColumn === column && this.sortAscending;
  }
}