import { Component, OnInit } from '@angular/core';
import { DatosUsuarioService } from '../../../../services/datos-usuario.service';

@Component({
  selector: 'app-cuenta-corriente',
  templateUrl: './cuenta-corriente.component.html'
})
export class CuentaCorrienteComponent implements OnInit {
  datosUsuarioActual: any;
  saldoCtaCte: any;
  saldo: any;

  constructor(
    private datosUsuarioService: DatosUsuarioService
  ) { }

  ngOnInit(): void {
    this.datosUsuarioService.getDatosUsuario().subscribe(datos => {
      this.datosUsuarioActual = datos;
      this.saldo = parseFloat(this.datosUsuarioActual.datosUsuario.montosUsuario.ctaCte.ctaCteSaldo);
      for (let trans of this.datosUsuarioActual.datosUsuario.montosUsuario.ctaCte.ctaCteTrans) {
        this.saldo = this.saldo - trans.cargo + trans.abono;
        trans.saldoFinal = this.saldo;
      }
      this.datosUsuarioActual.datosUsuario.montosUsuario.ctaCte.ctaCteTrans.reverse();
      console.log(this.datosUsuarioActual);
    }, error => {
      console.error('Error obteniendo los datos: ', error);
    });
  }
}