import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// Datos usuario
import { DatosUsuarioService } from '../../core/services/datos-usuario.service';
import { DatosUsuarioActual } from '../../shared/models/datos-usuario.model';
// Productos usuario
import { ProductosUsuarioService } from '../../core/services/productos-usuario.service';
import { ProductosUsuario } from '../../shared/models/productos-usuario.model';
// Datos ofertas
import { OfertasProductosService } from '../../core/services/ofertas-productos.service';
import { OfertasProductos } from './../../shared/models/ofertas-productos.model';

//import { SaldosService } from '../../core/services/saldos.service';

@Component({
  selector: 'app-resumen-usuario',
  templateUrl: './resumen-usuario.component.html'
})
export class ResumenUsuarioComponent implements OnInit {
  // saldoCtaCte: any;
  // saldoLineaCre: any;
  // saldoVisa: any;

  datosUsuarioActual: DatosUsuarioActual | undefined;

  // Variables para ofertas
  ofertasProductos: { ofertas: any[] } = { ofertas: [''] };
  montoPreAprobadoCreditoConsumo: any;
  montoPreAprobadoSeguroAuto: any;
  montoPreAprobadoDescuentoVisa: any;

  // Variables para productos
  productosUsuario: { productos: any[] } = { productos: [''] };
  cupoCtaCte: any | undefined;
  cupoLineaCredito: any | undefined;
  cupoVisa: any | undefined;
  numeroCtaCte: any | undefined;
  numeroLineaCredito: any | undefined;
  numeroVisa: any | undefined;

  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private productosUsuarioService: ProductosUsuarioService,
    private ofertasProductosService: OfertasProductosService,
    // private saldosService: SaldosService,
  ) {}

  ngOnInit(): void {
    this.getDatosUsuario();
    this.getProductosUsuario('');
    this.getOfertasProductos('')
  }
  
  getDatosUsuario(): void {
    this.datosUsuarioService.getDatosUsuario().subscribe(data => {
      this.datosUsuarioActual = data;
    });
  }

  getProductosUsuario(id: string): void {
    this.productosUsuarioService.getProductosUsuario(id).subscribe(data => {
      this.productosUsuario = data.productos ? { productos: data.productos } : { productos: [] };
      this.cupoCtaCte = this.productosUsuario.productos[0].cupo;
      this.cupoLineaCredito = this.productosUsuario.productos[1].cupo;
      this.cupoVisa = this.productosUsuario.productos[2].cupo;
      this.numeroCtaCte = this.productosUsuario.productos[0].productoNumero;
      this.numeroLineaCredito = this.productosUsuario.productos[1].productoNumero;
      this.numeroVisa = this.productosUsuario.productos[2].productoNumero;
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
