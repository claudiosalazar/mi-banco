import { Component, OnInit } from '@angular/core';
import { DatosUsuarioService } from '../../../../../services/datos-usuario.service';
import { SaldosService } from '../../../../../services/saldos.service';
import { DatosUsuarioActual } from '../../../../../../assets/models/datos-usuario.model';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';


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
      productoParaPago: [0, Validators.required, this.nonZeroValidator],
      otroMontoPago: ['', [Validators.required, Validators.min(1)]],
      emailComprobante: [this.datosUsuarioActual?.datosUsuario?.email || null, [Validators.email]],
    });
  }

  nonZeroValidator(control: AbstractControl): Promise<ValidationErrors | null> {
    return new Promise(resolve => {
      resolve(control.value === 0 ? { nonZero: true } : null);
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

  onOtroMontoPagoChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (!target.value) {
      return;
    }
  
    const numericValue = parseFloat(target.value.replace(/\D/g, ''));
    const formattedValue = isNaN(numericValue) ? '' : numericValue.toLocaleString('es-CL', { minimumFractionDigits: 0 });
    const otroMontoPagoControl = this.form.get('otroMontoPago');
    if (otroMontoPagoControl) {
      otroMontoPagoControl.setValue(formattedValue, { emitEvent: false });
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
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancelarClick(): void {
    const control = this.form.get('productoParaPago');
    if (control) {
      control.setValue(0);
    }
    this.productoSeleccionado = '0';
  }
  
}
