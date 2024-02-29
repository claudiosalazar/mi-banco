import { Component, OnInit } from '@angular/core';
import { SaldosService } from '../../../core/services/saldos.service';
// Datos usuario
import { DatosUsuarioService } from '../../../core/services/datos-usuario.service';
import { DatosUsuarioActual } from '../../../shared/models/datos-usuario.model';
// Productos usuario
import { ProductosUsuarioService } from '../../../core/services/productos-usuario.service';
import { ProductosUsuario } from '../../../shared/models/productos-usuario.model';
// Datos ofertas
import { OfertasProductosService } from '../../../core/services/ofertas-productos.service';
import { OfertasProductos } from './../../../shared/models/ofertas-productos.model';

@Component({
  selector: 'app-transacciones-resumen',
  templateUrl: './transacciones-resumen.component.html'
})
export class TransaccionesResumenComponent implements OnInit {
  saldoCtaCte: any;
  saldoLineaCre: any;
  saldoVisa: any;
  datosUsuarioActual: DatosUsuarioActual | undefined;
  productosUsuario: ProductosUsuario | undefined;

  // Instancia para modelo ofertas
  ofertasProductos: OfertasProductos | undefined;

  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private montosUsuarioService: DatosUsuarioService,
    private productosUsuarioService: ProductosUsuarioService,
    private ofertasProductosService: OfertasProductosService,
    private saldosService: SaldosService
  ) { }

  ngOnInit(): void {
    this.getDatosUsuario();
  }
  
  getProductosUsuario(): void {
    // |this.productosUsuarioService.getProductosUsuario().subscribe(data => {
      // this.productosUsuario = data;
      // this.saldoCtaCte =  this.productosUsuario.productos[0].transacciones.reduce((acc, transaccion) => acc + transaccion, 0);
      // this.saldoLineaCre =  this.productosUsuario.productos[1].transacciones.reduce((acc, transaccion) => acc + transaccion, 0);
      // this.saldoVisa =  this.productosUsuario.productos[2].transacciones.reduce((acc, transaccion) => acc + transaccion, 0);
      // this.saldoLineaCre = this.saldosService.calcularSaldoLineaCre(this.datosUsuarioActual);
      // this.saldoVisa = this.saldosService.calcularSaldoVisa(this.datosUsuarioActual);
    // });
  }

  getDatosUsuario(): void {
    this.datosUsuarioService.getDatosUsuario().subscribe(data => {
      this.datosUsuarioActual = data;
      // this.saldoCtaCte = this.saldosService.calcularSaldoCtaCte(this.datosUsuarioActual);
      // this.saldoLineaCre = this.saldosService.calcularSaldoLineaCre(this.datosUsuarioActual);
      // this.saldoVisa = this.saldosService.calcularSaldoVisa(this.datosUsuarioActual);
    });
  }

  getMontosUsuario(): void {
    this.montosUsuarioService.getDatosUsuario().subscribe(data => {
      this.datosUsuarioActual = data;
    });
  }

  getOfertasProductos(id: string): void {
    this.ofertasProductosService.getOfertasProductos(id).subscribe(data => {
      this.ofertasProductos = data;
    });
  }
}
