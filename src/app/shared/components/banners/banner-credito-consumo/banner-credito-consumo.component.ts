import { Component, OnInit } from '@angular/core';
import { DatosUsuarioService } from '../../../../services/datosUsuario.service';
import { DatosUsuario } from '../../../../models/datos-usuario.model';
import { OfertasService } from '../../../../services/ofertas.service';
import { Ofertas } from '../../../../models/ofertas.model';

@Component({
  selector: 'mb-banner-credito-consumo',
  templateUrl: './banner-credito-consumo.component.html'
})
export class BannerCreditoConsumoComponent implements OnInit {

  primer_nombre: any;
  apellido_paterno: any;
  ofertas: Ofertas[] = [];

  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private ofertasService: OfertasService
  ) { }

  ngOnInit() {
    this.datosUsuarioService.getDatosUsuario().subscribe((datos: DatosUsuario[]) => {
      if (datos.length > 0) {
        const usuario = datos[0];
        this.primer_nombre = usuario.primer_nombre;
        this.apellido_paterno = usuario.apellido_paterno;
      }
    });

    this.ofertasService.getOfertas().subscribe((ofertas: Ofertas[]) => {
      if (ofertas) {
        this.ofertas = ofertas;
      }
    });
  }

}