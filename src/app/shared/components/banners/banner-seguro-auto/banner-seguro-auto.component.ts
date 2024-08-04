import { Component, OnInit } from '@angular/core';
import { OfertasService } from '../../../../services/ofertas.service';
import { Ofertas } from '../../../../models/ofertas.model';

@Component({
  selector: 'mb-banner-seguro-auto',
  templateUrl: './banner-seguro-auto.component.html'
})
export class BannerSeguroAutoComponent implements OnInit {

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
