import { Component, OnInit } from '@angular/core';
import { DatosUsuarioService } from '../../../../../services/datos-usuario.service';
import { SaldosService } from '../../../../../services/saldos.service';
import { DatosUsuarioActual } from '../../../../../../assets/models/datos-usuario.model';
import { FormBuilder, Validators } from '@angular/forms';

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
  otroMontoPago: any;
  emailModificado = false;

  form = this.fb.group({
    productoParaPago: ['', Validators.required],
    otroMontoPago: ['', [Validators.required, Validators.min(1)]],
    emailComprobante: ['', [Validators.required, Validators.email]]
  });

  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private montosUsuarioService: DatosUsuarioService,
    private saldosService: SaldosService,
    private fb: FormBuilder
    
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

  onOtroMontoPagoChange(value: string): void {
    const numericValue = parseFloat(value.replace(/\D/g, ''));
    this.otroMontoPago = isNaN(numericValue) ? '' : numericValue.toLocaleString('es-CO');
  }

  

  onSubmit(): void {
    if (this.form.valid) {
      // Aquí puedes manejar el envío del formulario
    } else {
      this.form.markAllAsTouched(); // Marca todos los form controls como "touched" para que se muestren los mensajes de error
    }
  }
  
}
