import { Component, OnInit } from '@angular/core';
import { DatosUsuarioService } from '../../../../services/datosUsuario.service';
import { DatosUsuario } from '../../../../models/datos-usuario.model';

@Component({
  selector: 'mb-banner-credito-consumo',
  templateUrl: './banner-credito-consumo.component.html'
})
export class BannerCreditoConsumoComponent implements OnInit {

  primer_nombre: any;
  apellido_paterno: any;

  constructor(
    private datosUsuarioService: DatosUsuarioService
  ) { }

  ngOnInit() {
    this.datosUsuarioService.getDatosUsuario().subscribe((datos: DatosUsuario[]) => {
      if (datos.length > 0) {
        const usuario = datos[0];
        this.primer_nombre = usuario.primer_nombre;
        this.apellido_paterno = usuario.apellido_paterno;
      }
    });
  }

}
