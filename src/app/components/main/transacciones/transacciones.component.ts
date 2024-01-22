import { Component, NgIterable, OnInit } from '@angular/core';
import { DatosUsuarioService } from '../../../services/datos-usuario.service';

@Component({
  selector: 'app-transacciones',
  templateUrl: './transacciones.component.html'
})
export class TransaccionesComponent implements OnInit {
  transacciones: any[] = [];
  paginaActual = 1;
  elementosPorPagina = 5;

  constructor(private datosUsuarioService: DatosUsuarioService) { }

  ngOnInit() {
    this.datosUsuarioService.getDatosUsuario().subscribe(datos => {
      this.transacciones = (datos.transacciones as unknown as Array<any>).slice().reverse();
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
  }
}