import { Component, OnInit } from '@angular/core';
import { DatosUsuarioService } from '../../../core/services/datos-usuario.service';
import { DatosUsuarioActual } from '../../../shared/models/datos-usuario.model';

@Component({
  selector: 'app-seguros-resumen',
  templateUrl: './seguros-resumen.component.html'
})
export class SegurosResumenComponent implements OnInit {
  datosUsuarioActual: DatosUsuarioActual | undefined;

  constructor(
    private datosUsuarioService: DatosUsuarioService
  ) { }

  ngOnInit(): void {
    this.getDatosUsuario();
  }

  getDatosUsuario(): void {
    this.datosUsuarioService.getDatosUsuario().subscribe(data => {
      this.datosUsuarioActual = data;
    });
  }
}
