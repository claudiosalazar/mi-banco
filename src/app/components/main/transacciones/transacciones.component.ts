import { Component, NgIterable, OnInit } from '@angular/core';
import { DatosUsuarioService } from '../../../services/datos-usuario.service';

@Component({
  selector: 'app-transacciones',
  templateUrl: './transacciones.component.html'
})
export class TransaccionesComponent  {
  /* transacciones: any[] = [];
  paginaActual = 1;
  elementosPorPagina = 5;
  ctaCteMonto!: number;

  constructor(private datosUsuarioService: DatosUsuarioService) { }

  ngOnInit() {
    this.datosUsuarioService.getDatosUsuario().subscribe(datos => {
      this.ctaCteMonto = Number(datos.montosUsuario.ctaCteMonto);
      if (Array.isArray(datos.transacciones)) {
        this.transacciones = datos.transacciones.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
      } else {
        this.transacciones = [];
      }
      this.transacciones = this.transacciones.map((transaccion, index, arr) => {
        let abonos = Number(transaccion.col4);
        let cargos = Number(transaccion.col3);
        this.ctaCteMonto = this.ctaCteMonto + abonos - cargos;
        transaccion.col5 = this.ctaCteMonto;
        return transaccion;
      });
      this.transacciones = this.transacciones.reverse();
    });
  }

  get transaccionesPaginadas() {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.transacciones.slice(inicio, fin);
  }

  siguientePagina() {
    if (this.paginaActual < Math.ceil(this.transacciones.length / this.elementosPorPagina)) {
      this.paginaActual++;
    }
  }

  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  range(start: number, end: number) {
    return Array.from({length: end - start}, (v, k) => k + start);
  } */
}