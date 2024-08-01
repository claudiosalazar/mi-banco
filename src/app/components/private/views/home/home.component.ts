import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../../../services/productos.service';
import { Productos } from '../../../../models/productos.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {

  productos: Productos[] = [];
  ultimasTransaccionesCtaCte = true;
  ultimasTransaccionesLineaCredito = false;
  ultimasTransaccionesVisa = false;

  isActiveCtaCte = true;
  isActiveLineaCredito = false;
  isActiveVisa = false;
  
  constructor(
    private productosService: ProductosService
  ) { }

  ngOnInit() {
    this.productosService.getSeguros().subscribe((productos: Productos[]) => {
      if (productos) {
        this.productos = productos;
      }
    });
  }

  mostrarTransaccionesCtaCte(): void {
    this.ultimasTransaccionesCtaCte = true;
    this.ultimasTransaccionesLineaCredito = false;
    this.ultimasTransaccionesVisa = false;
    this.isActiveCtaCte = true;
    this.isActiveLineaCredito = false;
    this.isActiveVisa = false;
  }

  mostrarTransaccionesLineaCredito(): void {
    this.ultimasTransaccionesCtaCte = false;
    this.ultimasTransaccionesLineaCredito = true;
    this.ultimasTransaccionesVisa = false;
    this.isActiveCtaCte = false;
    this.isActiveLineaCredito = true;
    this.isActiveVisa = false;
  }

  mostrarTransaccionesVisa(): void {
    this.ultimasTransaccionesCtaCte = false;
    this.ultimasTransaccionesLineaCredito = false;
    this.ultimasTransaccionesVisa = true;
    this.isActiveCtaCte = false;
    this.isActiveLineaCredito = false;
    this.isActiveVisa = true;
  }
}
