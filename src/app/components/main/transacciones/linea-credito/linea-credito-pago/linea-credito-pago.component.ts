import { Component, OnInit } from '@angular/core';
import { DatosUsuarioService } from '../../../../../services/datos-usuario.service';
import { SaldosService } from '../../../../../services/saldos.service';
import { DatosUsuarioActual } from '../../../../../../assets/models/datos-usuario.model';

@Component({
  selector: 'app-linea-credito-pago',
  templateUrl: './linea-credito-pago.component.html'
})
export class LineaCreditoPagoComponent implements OnInit {
  saldoCtaCte: number | undefined;
  saldoLineaCredito: number | undefined;
  saldoVisa: number | undefined;
  datosUsuarioActual: DatosUsuarioActual | undefined;
  productoSeleccionado: any;
  cupoUtilizado: any;
  pagoTotalCheck = false;
  montoApagarOption = 'otroMontoPago';

  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private montosUsuarioService: DatosUsuarioService,
    private saldosService: SaldosService,
    
  ) { }

  ngOnInit(): void {
    this.getDatosUsuario();
  }

  getDatosUsuario(): void {
    this.datosUsuarioService.getDatosUsuario().subscribe(data => {
      this.datosUsuarioActual = data;
      this.saldoCtaCte = this.saldosService.calcularSaldoCtaCte(this.datosUsuarioActual);
      this.saldoLineaCredito = this.saldosService.calcularSaldoLineaCre(this.datosUsuarioActual);
      this.cupoUtilizado = this.saldosService.calcularDiferenciaLineaCre(this.datosUsuarioActual);
      this.saldoVisa = this.saldosService.calcularSaldoVisa(this.datosUsuarioActual);
    });
  }

  getMontosUsuario(): void {
    this.montosUsuarioService.getDatosUsuario().subscribe(data => {
      this.datosUsuarioActual = data;
    });
  }

  onProductoSeleccionado(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.productoSeleccionado = target.value;
    }
  }

  onMontoApagarOptionChange(option: string): void {
    this.montoApagarOption = option;
  }
  
}
