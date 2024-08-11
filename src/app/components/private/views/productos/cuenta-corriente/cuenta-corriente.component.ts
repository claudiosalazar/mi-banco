import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../../../../services/productos.service';
import { Productos } from '../../../../../models/productos.model';
import { TransaccionesService } from '../../../../../services/transacciones.service';
import { CuentaCorriente } from '../../../../../models/cuenta-corriente.model';
import { LineaCredito } from '../../../../../models/linea-credito.model';
import { filter } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-cuenta-corriente',
  templateUrl: './cuenta-corriente.component.html'
})
export class CuentaCorrienteComponent implements OnInit {

  urlActual: any;

  productos: Productos[] = [];
  transaccionesCtaCte: CuentaCorriente[] = [];
  transaccionesLineaCre: LineaCredito[] = [];
  saldoUltimaTransaccionCtaCte: number | null = null;
  fechaYhoraActual: Date = new Date();
  saldo: any;
  abono: any;
  cargo: any;

  activeTab: string = 'transferencias';

  constructor(
    private route: Router,
    private productosService: ProductosService,
    private transaccionesService: TransaccionesService,
  ) { 
    this.urlActual = this.route.url;
  }

  ngOnInit() {
    this.productosService.getProductos().subscribe((productos: Productos[]) => {
      if (productos) {
        this.productos = productos;
      }
    });

    this.transaccionesService.getTransCuentaCorriente().subscribe((transaccionesCtaCte: CuentaCorriente[]) => {
      if (transaccionesCtaCte) {
        this.transaccionesCtaCte = transaccionesCtaCte;
        this.transaccionesCtaCte.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        this.saldoUltimaTransaccionCtaCte = this.transaccionesCtaCte.length > 0 ? this.transaccionesCtaCte[0].saldo : null;
      }
    });

    this.transaccionesService.getTransLineaCredito().subscribe((transaccionesLineaCre: LineaCredito[]) => {
      if (transaccionesLineaCre) {
        this.transaccionesLineaCre = transaccionesLineaCre;
        const transaccionesOrdenadas = transaccionesLineaCre.sort((a, b) => b.id_trans_linea_cre - a.id_trans_linea_cre);
        this.saldo = transaccionesOrdenadas[0]?.saldo;
        this.cargo = transaccionesOrdenadas.find(trans => trans.cargo !== null)?.cargo;
        this.abono = transaccionesOrdenadas.find(trans => trans.abono !== null)?.abono;
      }
    });

    this.route.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
      this.urlActual = event.urlAfterRedirects;
    });

  }

}