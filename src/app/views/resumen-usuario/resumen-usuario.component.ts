import { Component, OnInit } from '@angular/core';
// Datos usuario
import { DatosUsuarioService } from '../../core/services/datos-usuario.service';
// Productos usuario
import { ProductosUsuarioService } from '../../core/services/productos-usuario.service';
// Datos ofertas
import { OfertasProductosService } from '../../core/services/ofertas-productos.service';

@Component({
  selector: 'app-resumen-usuario',
  templateUrl: './resumen-usuario.component.html'
})
export class ResumenUsuarioComponent implements OnInit {

  datosUsuarioActual: any = {};

  // Variables para ofertas
  ofertasProductos: { ofertas: any[] } = { ofertas: [''] };
  montoPreAprobadoCreditoConsumo: any;
  montoPreAprobadoSeguroAuto: any;
  montoPreAprobadoDescuentoVisa: any;

  // Variables para productos
  productosUsuario: { productos: any[] } = { productos: [] };
  cupoCtaCte: any | undefined;
  cupoLineaCredito: any | undefined;
  cupoVisa: any | undefined;
  numeroCtaCte: any | undefined;
  numeroLineaCredito: any | undefined;
  numeroVisa: any | undefined;
  primerNombre: any | undefined;
  apellidoPaterno: any | undefined;

  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private productosUsuarioService: ProductosUsuarioService,
    private ofertasProductosService: OfertasProductosService
  ) {}

  ngOnInit(): void {
    this.getDatosUsuario();
    this.getProductosUsuarioResumen('');
    this.getOfertasProductos('')
  }
  
  getDatosUsuario(): void {
    this.datosUsuarioService.getDatosUsuario().subscribe(data => {
      this.datosUsuarioActual = data.datosUsuario || {};
      this.primerNombre = this.datosUsuarioActual.primerNombre;
      this.apellidoPaterno = this.datosUsuarioActual?.apellidoPaterno;
    });
  }

  getProductosUsuarioResumen(id: string): void {
    this.productosUsuarioService.getProductosUsuarioResumen(id).subscribe(data => {
      this.productosUsuario = data.productos ? { productos: data.productos } : { productos: [] };
      this.cupoCtaCte = this.productosUsuario.productos[0]?.transacciones[this.productosUsuario.productos[0]?.transacciones.length - 1]?.saldo;
      this.numeroCtaCte = this.productosUsuario.productos[0]?.productoNumero;
      this.cupoLineaCredito = this.productosUsuario.productos[1]?.transacciones[this.productosUsuario.productos[1]?.transacciones.length - 1]?.saldo;
      this.numeroLineaCredito = this.productosUsuario.productos[1]?.productoNumero;
      this.cupoVisa = this.productosUsuario.productos[2]?.transacciones[this.productosUsuario.productos[2]?.transacciones.length - 1]?.saldo;
      this.numeroVisa = this.productosUsuario.productos[2]?.productoNumero;
    });
  }

  getOfertasProductos(id: string): void {
    this.ofertasProductosService.getOfertasProductos(id).subscribe(data => {
      this.ofertasProductos = data.ofertas ? { ofertas: data.ofertas } : { ofertas: [] };
      this.montoPreAprobadoCreditoConsumo = this.ofertasProductos.ofertas[0].montoPreAprobado;
      this.montoPreAprobadoSeguroAuto = this.ofertasProductos.ofertas[1].montoPreAprobado;
      this.montoPreAprobadoDescuentoVisa = this.ofertasProductos.ofertas[2].montoPreAprobado;
    });
  }

}
