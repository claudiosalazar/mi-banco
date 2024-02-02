import { Component, OnInit } from '@angular/core';
import { DatosUsuarioService } from '../../../../../services/datos-usuario.service';
import { SaldosService } from '../../../../../services/saldos.service';
import { DatosUsuarioActual } from '../../../../../../assets/models/datos-usuario.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  montoApagarOption = 'otroMontoPago';
  otroMontoPago: any;
  emailModificado = false;
  mostrarPagoTotalCheck: boolean = false;
  mostrarOtroMontoCheck: boolean = true;

  form: FormGroup = this.fb.group({
    monto: ['otroMontoCheck'],
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
    this.form = this.fb.group({
      monto: ['otroMontoCheck'],
      productoParaPago: ['', Validators.required],
      otroMontoPago: ['', [Validators.required, Validators.min(1)]],
      emailComprobante: [this.datosUsuarioActual?.datosUsuario?.email || null, [Validators.email]],
    });
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
    if (value === 'otroMontoCheck') {
      this.mostrarOtroMontoCheck = true;
      this.mostrarPagoTotalCheck = false;
    }
  }

  onEmailChange(): void {
    this.emailModificado = true;
    if (this.form.get('emailComprobante')?.value === '') {
      this.form.get('emailComprobante')?.setValidators([Validators.required, Validators.email]);
    } else {
      this.form.get('emailComprobante')?.setValidators([Validators.email]);
    }
    this.form.get('emailComprobante')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.form.valid) {
      // Aquí puedes manejar el envío del formulario
    } else {
      this.form.markAllAsTouched(); // Marca todos los form controls como "touched" para que se muestren los mensajes de error
    }
  }
  
}
