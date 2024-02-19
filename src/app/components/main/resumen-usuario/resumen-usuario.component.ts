import { Component, OnInit } from '@angular/core';
import { DatosUsuarioService } from '../../../services/datos-usuario.service';
import { SaldosService } from '../../../services/saldos.service';
import { DatosUsuarioActual } from '../../../../assets/models/datos-usuario.model';

@Component({
  selector: 'app-resumen-usuario',
  templateUrl: './resumen-usuario.component.html'
})
export class ResumenUsuarioComponent implements OnInit {
  saldoCtaCte?: number;
  saldoLineaCre?: number;
  saldoVisa?: number;
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
      this.saldosService.calcularSaldoCtaCte(this.datosUsuarioActual).subscribe(saldo => this.saldoCtaCte = saldo);
      this.saldosService.calcularSaldoLineaCre(this.datosUsuarioActual).subscribe(saldo => this.saldoLineaCre = saldo);
      this.saldosService.calcularSaldoVisa(this.datosUsuarioActual).subscribe(saldo => this.saldoVisa = saldo);
    });
  }

  getMontosUsuario(): void {
    this.montosUsuarioService.getDatosUsuario().subscribe(data => {
      this.datosUsuarioActual = data;
    });
  }

}
