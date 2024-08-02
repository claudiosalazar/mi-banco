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
  transaccionesFiltradas: Transacciones[] = [];
  transaccionMasReciente: Transacciones | null = null;
  formularioPagoVisa = false;
  comprobantePagoVisa = false;
  movimientosVisa = true;

  constructor(
    private productosService: ProductosService,
    private transaccionesService: TransaccionesService
  ) { }

  ngOnInit() {
    this.productosService.getProductos().subscribe((productos: Productos[]) => {
      if (productos) {
        this.productos = productos;
      }
    });

    this.transaccionesService.getTransacciones().subscribe((transacciones: Transacciones[]) => {
      if (transacciones) {
        this.transaccionesFiltradas = transacciones.filter(transaccion => 
          transaccion.id_producto === 2 && transaccion.abono != null
        );
        this.transaccionMasReciente = this.obtenerTransaccionMasRecienteConAbono();
      }
    });
  }

  obtenerTransaccionMasRecienteConAbono(): Transacciones | null {
    if (this.transaccionesFiltradas.length === 0) {
      return null;
    }
    return this.transaccionesFiltradas
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0];
  }

  mostrarPagoVisa(): void {
    this.movimientosVisa = false;
    this.formularioPagoVisa = true;
    this.comprobantePagoVisa = false;
  }
}