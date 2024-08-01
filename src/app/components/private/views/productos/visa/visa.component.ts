import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../../../../services/productos.service';
import { Productos } from '../../../../../models/productos.model';
import { TransaccionesService } from '../../../../../services/transacciones.service';
import { Transacciones } from '../../../../../models/transacciones.model';

@Component({
  selector: 'app-visa',
  templateUrl: './visa.component.html'
})
export class VisaComponent implements OnInit {

  productos: Productos[] = [];
  transacciones: Transacciones[] = [];

  movimientosVisa = true;
  formularioPagoVisa = false;
  comprobantePagoVisa = false;

  constructor(
    private productosService: ProductosService,
    private transaccionesService: TransaccionesService
  ) { }

  ngOnInit() {
    this.productosService.getSeguros().subscribe((productos: Productos[]) => {
      if (productos) {
        this.productos = productos;
      }
    });

    this.transaccionesService.getTransacciones().subscribe((transacciones: Transacciones[]) => {
      if (transacciones) {
        this.transacciones = transacciones;
      }
    });
  }

  getTransaccionesVisa() {
    return this.transacciones.filter(transaccion => transaccion.id_producto === 2);
  }

  mostrarPagoVisa(): void {
    this.movimientosVisa = false;
    this.formularioPagoVisa = true;
    this.comprobantePagoVisa = false;

    //this.urlBrowserService.navegarAPagoVisa();
  }

}
