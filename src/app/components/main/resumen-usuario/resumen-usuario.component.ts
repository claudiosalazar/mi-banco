import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreadcrumbService } from '../../../services/breadcrumb.service';
import { DatosUsuarioService } from '../../../services/datos-usuario.service';
import { SaldosService } from '../../../services/saldos.service';
import { DatosUsuarioActual } from '../../../../assets/models/datos-usuario.model';

@Component({
  selector: 'app-resumen-usuario',
  templateUrl: './resumen-usuario.component.html'
})
export class ResumenUsuarioComponent implements OnInit, OnDestroy {
  saldoCtaCte: number | undefined;
  saldoLineaCre: number | undefined;
  saldoVisa: number | undefined;
  datosUsuarioActual: DatosUsuarioActual | undefined;

  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private montosUsuarioService: DatosUsuarioService,
    private breadcrumbService: BreadcrumbService,
    private saldosService: SaldosService
  ) { }

  ngOnInit(): void {
    this.getDatosUsuario();
    this.breadcrumbService.hide();
  }
  

  ngOnDestroy() {
    this.breadcrumbService.show();
  }

  getDatosUsuario(): void {
    this.datosUsuarioService.getDatosUsuario().subscribe(data => {
      this.datosUsuarioActual = data;
      this.saldoCtaCte = this.saldosService.calcularSaldoCtaCte(this.datosUsuarioActual);
      this.saldoLineaCre = this.saldosService.calcularSaldoLineaCre(this.datosUsuarioActual);
      this.saldoVisa = this.saldosService.calcularSaldoVisa(this.datosUsuarioActual);
    });
  }

  getMontosUsuario(): void {
    this.montosUsuarioService.getDatosUsuario().subscribe(data => {
      this.datosUsuarioActual = data;
    });
  }

}