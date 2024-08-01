import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../../../../services/productos.service';
import { Productos } from '../../../../../models/productos.model';

@Component({
  selector: 'app-linea-credito',
  templateUrl: './linea-credito.component.html'
})
export class LineaCreditoComponent implements OnInit {

  productos: Productos[] = [];

  formularioPagoLineaDeCredito = false;
  comprobantePagoLineaDeCredito = false;
  movimientosLineaDeCredito = true;

  constructor(
    private productosService: ProductosService,
  ) { }

  ngOnInit() {
    this.productosService.getSeguros().subscribe((productos: Productos[]) => {
      if (productos) {
        this.productos = productos;
      }
    });
  }

  mostrarPagoLineaDeCredito(): void {
    this.movimientosLineaDeCredito = false;
    this.formularioPagoLineaDeCredito = true;
    this.comprobantePagoLineaDeCredito = false;

    //this.urlBrowserService.navegarAPagoLineaDeCredito();
  }

}
