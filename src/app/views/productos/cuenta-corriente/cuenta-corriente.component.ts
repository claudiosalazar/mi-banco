import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

// Services
import { ProductosUsuarioService } from '../../../core/services/productos-usuario.service';
import { OfertasProductosService } from '../../../core/services/ofertas-productos.service';

@Component({
  selector: 'app-cuenta-corriente',
  templateUrl: './cuenta-corriente.component.html',
  providers: [DatePipe]
})
export class CuentaCorrienteComponent implements OnInit {

  currentUrl: any;
  productosUsuario: { productos: any[] } = { productos: [] };
  cupoCtaCte: any;
  numeroCtaCte: any;
  cupoLineaCredito: any;
  numeroLineaCredito: any;
  fechaYhoraActual: any;

  // Variables para ofertas
  ofertasProductos: { ofertas: any[] } = { ofertas: [''] };
  montoPreAprobadoCreditoConsumo: any;
  ultimoCargo: any | undefined;
  ultimoAbono: any | undefined;

  constructor(
    private route: Router,
    private productosUsuarioService: ProductosUsuarioService,
    private ofertasProductosService: OfertasProductosService,
    private datePipe: DatePipe
  ) {
    this.currentUrl = this.route.url;
  }

  ngOnInit(): void {
    this.getProductosUsuarioResumen('');
    this.getOfertasProductos('');
    this.fechaYhoraActual = this.datePipe.transform(new Date(), 'short');
    this.route.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.urlAfterRedirects;
    });
  }

  getProductosUsuarioResumen(id: string): void {
    this.productosUsuarioService.getProductosUsuarioResumen(id).subscribe(
      data => {
        this.productosUsuario = data.productos ? { productos: data.productos } : { productos: []};
        this.cupoCtaCte = parseFloat(this.productosUsuario.productos[0]?.transacciones[this.productosUsuario.productos[0]?.transacciones.length - 1]?.saldo);
        this.ultimoCargo = this.productosUsuario.productos[0]?.transacciones[this.productosUsuario.productos[0]?.transacciones.length - 1]?.cargo;
        this.ultimoAbono = this.productosUsuario.productos[0]?.transacciones[this.productosUsuario.productos[0]?.transacciones.length - 1]?.abono;
        this.numeroCtaCte = parseFloat(this.productosUsuario.productos[0]?.productoNumero);
        this.cupoLineaCredito = parseFloat(this.productosUsuario.productos[1]?.transacciones[this.productosUsuario.productos[1]?.transacciones.length - 1]?.saldo);
        this.numeroLineaCredito = parseFloat(this.productosUsuario.productos[1]?.productoNumero);
      }
    );
  }

  getOfertasProductos(id: string): void {
    this.ofertasProductosService.getOfertasProductos(id).subscribe(data => {
      this.ofertasProductos = data.ofertas ? { ofertas: data.ofertas } : { ofertas: [] };
      this.montoPreAprobadoCreditoConsumo = this.ofertasProductos.ofertas[0].montoPreAprobado;
    });
  }

}