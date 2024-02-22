import { Component, OnInit } from '@angular/core';
import { DatosUsuarioService } from '../../../core/services/datos-usuario.service';
import { FormControl } from '@angular/forms'
import { DatosUsuarioActual } from '../../../shared/models/datos-usuario.model';

@Component({
  selector: 'app-visa',
  templateUrl: './visa.component.html'
})
export class VisaComponent implements OnInit {
  datosUsuarioActual: any;
  saldo: any;
  currentPage = 1;
  itemsPerPage = 5;
  pages: number[] = [];
  datosOriginales: DatosUsuarioActual['datosUsuario']['montosUsuario']['visa']['transacciones'][] = [];

  // Tus datos actuales que se mostrarán en la tabla
  datosActuales: DatosUsuarioActual['datosUsuario']['montosUsuario']['visa']['transacciones'][] = [];

  // FormControl para el campo de búsqueda
  campoBusqueda = new FormControl('');
  fechaUltimoAbono: any;
  ultimoMontoAbono: any;

  constructor(
    private datosUsuarioService: DatosUsuarioService
  ) { }

  ngOnInit(): void {
    this.datosUsuarioService.getDatosUsuario().subscribe(datos => {
      this.datosUsuarioActual = datos;
      this.datosOriginales = this.datosUsuarioActual.datosUsuario.montosUsuario.visa.transacciones;
      // Inicialmente, los datos actuales son todos los datos
      this.datosActuales = this.datosOriginales;
      this.saldo = parseFloat(this.datosUsuarioActual.datosUsuario.montosUsuario.visa.cupo);
      for (let trans of this.datosOriginales) {
        this.saldo = this.saldo - trans.cargo + trans.abono;
        trans.saldo = this.saldo;
      }
      let ultimoAbono = this.datosOriginales
        .filter(trans => trans.abono > 0)
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0];

      this.fechaUltimoAbono = ultimoAbono ? ultimoAbono.fecha : null;
      this.ultimoMontoAbono = ultimoAbono ? ultimoAbono.abono : null;
      this.campoBusqueda.valueChanges.subscribe(textoBusqueda => {
        if (textoBusqueda) {
          // Filtrar los datos basándose en el texto de búsqueda
          this.datosActuales = this.datosOriginales.filter(trans => trans.detalle.toLowerCase().includes(textoBusqueda.toLowerCase()));
        } else {
          // Si no hay texto de búsqueda, mostrar todos los datos
          this.datosActuales = this.datosOriginales;
        }
      });
      this.datosActuales = this.datosOriginales;
      this.datosUsuarioActual.datosUsuario.montosUsuario.visa.transacciones.reverse();
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
    this.datosUsuarioActual.datosUsuario.montosUsuario.visa.transacciones.sort((a: { fecha: string | number | Date; }, b: { fecha: string | number | Date; }) => {
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
    this.datosUsuarioActual.datosUsuario.montosUsuario.visa.transacciones.sort((a: { detalle: number; }, b: { detalle: number; }) => {
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
  
    this.datosUsuarioActual.datosUsuario.montosUsuario.visa.transacciones.sort((a: { [x: string]: number; }, b: { [x: string]: number; }) => {
      return a[column] > b[column] ? this.sortOrder : a[column] < b[column] ? -this.sortOrder : 0;
    });
  }

  // Funcion para animacion de icono en th
  isColumnRotated(column: string): boolean {
    return this.currentSortColumn === column && this.sortAscending;
  }

  getPaginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = this.currentPage * this.itemsPerPage;
    return this.datosActuales.slice(start, end);
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
    const totalPages = Math.ceil((this.datosUsuarioActual?.datosUsuario?.montosUsuario?.visa?.transacciones.length || 0) / this.itemsPerPage);
    this.pages = Array(totalPages).fill(0).map((x,i)=>i+1);
  }
}
