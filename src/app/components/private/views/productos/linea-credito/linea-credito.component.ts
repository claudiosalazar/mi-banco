import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../../../../services/productos.service';
import { Productos } from '../../../../../models/productos.model';
import { TransaccionesService } from 'src/app/services/transacciones.service';
import { Transacciones } from 'src/app/models/transacciones.model';

@Component({
  selector: 'app-linea-credito',
  templateUrl: './linea-credito.component.html'
})
export class LineaCreditoComponent implements OnInit {

  productos: Productos[] = [];
  transaccionesFiltradas: Transacciones[] = [];
  transaccionMasReciente: Transacciones | null = null;
  formularioPagoLineaDeCredito = false;
  comprobantePagoLineaDeCredito = false;
  movimientosLineaDeCredito = true;

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
        this.transaccionesFiltradas = transacciones.filter(transaccion => 
          transaccion.id_producto === 1 && transaccion.abono != null
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

  mostrarPagoLineaDeCredito(): void {
    this.movimientosLineaDeCredito = false;
    this.formularioPagoLineaDeCredito = true;
    this.comprobantePagoLineaDeCredito = false;
  }

}