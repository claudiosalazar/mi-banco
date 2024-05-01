import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
// Datos usuario
import { DatosUsuarioService } from '../../core/services/datos-usuario.service';
import { MostrarBreadcrumbService } from '../../core/services/mostrar-breadcrumb.service';
// Productos usuario
import { ProductosUsuarioService } from '../../core/services/productos-usuario.service';
// Datos ofertas
import { OfertasProductosService } from '../../core/services/ofertas-productos.service';

@Component({
  selector: 'app-resumen-usuario',
  templateUrl: './resumen-usuario.component.html',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.3s ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ResumenUsuarioComponent implements OnInit {

  datosUsuarioActual: any = {};
  transaccionesCuentaCorriente: any[] = [];
  transaccionesLineaDeCredito: any[] = [];
  transaccionesVisa: any[] = [];
  productos: any[] = [];

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

  ultimasTransaccionesCtaCte = true;
  ultimasTransaccionesLineaCredito = false;
  ultimasTransaccionesVisa = false;

  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private productosUsuarioService: ProductosUsuarioService,
    private ofertasProductosService: OfertasProductosService,
    private mostrarBreadcrumbService: MostrarBreadcrumbService
  ) {}

  ngOnInit(): void {
    this.getDatosUsuario();
    this.getProductosUsuarioResumen('');
    this.getOfertasProductos('');
    this.getMovimientos();
    this.mostrarBreadcrumbService.cambiarEstado(true);
  }

  ngOnDestroy() {
    this.mostrarBreadcrumbService.cambiarEstado(false);
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

  getMovimientos(): void {
    this.productosUsuarioService.getProductosUsuarioTable().subscribe(data => {
      if (data.productos && data.productos.length > 0) {
        const cuentaCorriente = data.productos[0];
        if (cuentaCorriente) {
          this.transaccionesCuentaCorriente = cuentaCorriente.transacciones.slice(-3);
          console.log('Transacciones asignadas:', this.transaccionesCuentaCorriente);
        }
      }

      if (data.productos && data.productos.length > 1) {
        const lineaCredito = data.productos[1];
        if (lineaCredito) {
          this.transaccionesLineaDeCredito = lineaCredito.transacciones.slice(-3);
          console.log('Transacciones asignadas:', this.transaccionesLineaDeCredito);
        }
      }

      if (data.productos && data.productos.length > 2) {
        const visa = data.productos[2];
        if (visa) {
          this.transaccionesVisa = visa.transacciones.slice(-3);
          console.log('Transacciones asignadas:', this.transaccionesVisa);
        }
      }
    });
  }


  mostrarTransaccionesCtaCte(): void {
    this.ultimasTransaccionesCtaCte = true;
    this.ultimasTransaccionesLineaCredito = false;
    this.ultimasTransaccionesVisa = false;
  }

  mostrarTransaccionesLineaCredito(): void {
    this.ultimasTransaccionesCtaCte = false;
    this.ultimasTransaccionesLineaCredito = true;
    this.ultimasTransaccionesVisa = false;
  }

  mostrarTransaccionesVisa(): void {
    this.ultimasTransaccionesCtaCte = false;
    this.ultimasTransaccionesLineaCredito = false;
    this.ultimasTransaccionesVisa = true;
  }

}
