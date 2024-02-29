import { Component, OnInit } from '@angular/core';
// Datos usuario
import { DatosUsuarioService } from '../../../core/services/datos-usuario.service';
import { DatosUsuarioActual } from '../../../shared/models/datos-usuario.model';
// Datos seguros
import { SegurosUsuarioService } from '../../../core/services/seguros-usuario.service';
import { SegurosUsuario } from '../../../shared/models/seguros-usuario.model';
// Datos ofertas
import { OfertasProductosService } from '../../../core/services/ofertas-productos.service';
import { OfertasProductos } from './../../../shared/models/ofertas-productos.model';

@Component({
  selector: 'app-seguros-resumen',
  templateUrl: './seguros-resumen.component.html'
})
export class SegurosResumenComponent implements OnInit {

  datosUsuarioActual: DatosUsuarioActual | undefined;
  segurosUsuario: SegurosUsuario | undefined;
  ofertasProductos: OfertasProductos | undefined;

  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private segurosUsuarioService: SegurosUsuarioService,
    private ofertasProductosService: OfertasProductosService
  ) { }

  ngOnInit(): void {
    this.getSegurosUsuario();
  }

  getDatosUsuario(): void {
    this.datosUsuarioService.getDatosUsuario().subscribe(data => {
      this.datosUsuarioActual = data;
    });
  }

  getSegurosUsuario(): void {
    this.segurosUsuarioService.getSegurosUsuario().subscribe(data => {
      this.segurosUsuario = data;
    });
  }
  
  getOfertasProductos(id: string): void {
    this.ofertasProductosService.getOfertasProductos(id).subscribe(data => {
      this.ofertasProductos = data;
    });
  }
}
