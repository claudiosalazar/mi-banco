import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../../../../services/productos.service';
import { Productos } from '../../../../../models/productos.model';
import { TransaccionesService } from '../../../../../services/transacciones.service';
import { Transacciones } from '../../../../../models/transacciones.model';

@Component({
  selector: 'app-transacciones-resumen',
  templateUrl: './transacciones-resumen.component.html'
})
export class TransaccionesResumenComponent implements OnInit {

  productos: Productos[] = [];
  transacciones: Transacciones[] = [];

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

  getTransaccionesCtaCte() {
    return this.transacciones.filter(transaccion => transaccion.id_producto === 0);
  }
  
  getTransaccionesLineaCredito() {
    return this.transacciones.filter(transaccion => transaccion.id_producto === 1);
  }
  
  getTransaccionesVisa() {
    return this.transacciones.filter(transaccion => transaccion.id_producto === 2);
  }

}
