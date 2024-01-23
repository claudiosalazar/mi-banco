import { Component, OnInit } from '@angular/core';
import { DatosUsuarioService } from '../../../services/datos-usuario.service';
import { SaldosService } from '../../../services/saldos.service';
import { DatosUsuarioActual } from '../../../../assets/models/datos-usuario.model';

@Component({
  selector: 'app-transacciones',
  templateUrl: './transacciones.component.html'
})
export class TransaccionesComponent implements OnInit   {
  saldoCtaCte: number | undefined;
  saldoLineaCre: number | undefined;
  saldoVisa: number | undefined;
  datosUsuarioActual: DatosUsuarioActual | undefined;

  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private montosUsuarioService: DatosUsuarioService,
    private saldosService: SaldosService
  ) { }

  ngOnInit(): void {
    this.getDatosUsuario();
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