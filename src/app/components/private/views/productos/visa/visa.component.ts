import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../../../../services/productos.service';
import { Productos } from '../../../../../models/productos.model';

@Component({
  selector: 'app-visa',
  templateUrl: './visa.component.html'
})
export class VisaComponent implements OnInit {

  productos: Productos[] = [];

  movimientosVisa = true;
  formularioPagoVisa = false;
  comprobantePagoVisa = false;

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

  mostrarPagoVisa(): void {
    this.movimientosVisa = false;
    this.formularioPagoVisa = true;
    this.comprobantePagoVisa = false;

    //this.urlBrowserService.navegarAPagoVisa();
  }

}
