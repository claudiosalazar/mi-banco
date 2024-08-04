import { Component, OnInit } from '@angular/core';
import { OfertasService } from '../../../../services/ofertas.service';
import { Ofertas } from '../../../../models/ofertas.model';

@Component({
  selector: 'mb-banner-visa-descuento',
  templateUrl: './banner-visa-descuento.component.html'
})
export class BannerVisaDescuentoComponent implements OnInit {

  ofertas: Ofertas[] = [];

  constructor(
    private ofertasService: OfertasService
  ) { }

  ngOnInit() {
    this.ofertasService.getOfertas().subscribe((ofertas: Ofertas[]) => {
      if (ofertas) {
        this.ofertas = ofertas;
      }
    });
  }

}
