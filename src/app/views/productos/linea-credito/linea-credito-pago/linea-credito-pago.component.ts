import { Component, OnInit } from '@angular/core';
// Datos usuario
import { DatosUsuarioService } from '../../../../core/services/datos-usuario.service';
// Datos productos
import { ProductosUsuarioService } from 'src/app/core/services/productos-usuario.service';
import { ProductosUsuario } from '../../../../shared/models/productos-usuario.model';

import { SaldosService } from '../../../../core/services/saldos.service';
import { DatosUsuarioActual } from '../../../../shared/models/datos-usuario.model';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';



@Component({
  selector: 'app-linea-credito-pago',
  templateUrl: './linea-credito-pago.component.html'
})
export class LineaCreditoPagoComponent implements OnInit {

  saldo: number | undefined;
  datosUsuarioActual: DatosUsuarioActual | undefined;
  productoSeleccionado: any;
  cupoUtilizadoLineaCre: any;
  montoApagarOption = 'otroMontoPago';
  otroMontoPago: any;
  emailModificado = false;
  mostrarPagoTotalCheck: boolean = false;
  mostrarOtroMontoCheck: boolean = true;

  form: FormGroup = this.fb.group({
    monto: ['otroMontoCheck'],
    productoParaPago: ['', Validators.required],
    otroMontoPago: ['', [Validators.required, Validators.min(1), ]],
    emailComprobante: ['', [Validators.required, Validators.email]]
  });


  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private montosUsuarioService: DatosUsuarioService,
    private productosUsuarioService: ProductosUsuarioService,
    private saldosService: SaldosService,
    private fb: FormBuilder
    
  ) { }

  ngOnInit(): void {
    this.getDatosUsuario();
    this.form = this.fb.group({
      monto: ['otroMontoCheck'],
      productoParaPago: [0, Validators.required, this.nonZeroValidator],
      otroMontoPago: [{value: '', disabled: true}, [
        Validators.required,
        Validators.min(1),
        Validators.max((this.saldo ?? 0) || (this.saldo ?? 0)),
      ]],
      emailComprobante: [this.datosUsuarioActual?.datosUsuario?.email || null, [Validators.email]],
    });
  
    this.form.get('productoParaPago')?.valueChanges.subscribe(value => {
      if (value == '1' || value == '2') {
        this.form.get('otroMontoPago')?.enable();
      } else {
        this.form.get('otroMontoPago')?.disable();
      }
    });
  
    this.form.get('otroMontoPago')?.valueChanges.subscribe(value => {
      if (value <= (this.saldo ?? 0) && value <= (this.saldo ?? 0)) {
        this.form.get('otroMontoPago')?.setErrors(null);
      }
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
      // this.saldo = this.saldosService.calcularSaldoCtaCte(this.datosUsuarioActual);
      // this.saldoLineaCredito = this.saldosService.calcularSaldoLineaCre(this.datosUsuarioActual);
      // this.cupoUtilizadoLineaCre = this.saldosService.calcularDiferenciaLineaCre(this.datosUsuarioActual);
      // this.saldo = this.saldosService.calcularSaldoVisa(this.datosUsuarioActual);
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
      this.form.get('otroMontoPago')?.markAsTouched();
    }
  }

  onCancelarClick(): void {
    // Logica para select
    const controlSelect = this.form.get('productoParaPago');
    if (controlSelect) {
      controlSelect.setValue(0);
    }
    this.productoSeleccionado = '0';

    // Logica para monto
    const controlMonto = this.form.get('monto');

    if (controlMonto && controlMonto.value === 'pagoTotalCheck') {
      controlMonto.setValue('otroMontoCheck'); // Esto cambiará la selección del radio 'pagoTotalCheck' al radio 'otroMontoCheck'
    }

    if (this.montoApagarOption === 'pagoTotal') {
      this.montoApagarOption = 'otroMontoPago'; // Cambia la opción a 'otroMontoPago'
    }

    const controlOtroMontoPago = this.form.get('otroMontoPago');

    if (controlOtroMontoPago) {
      controlOtroMontoPago.setValue(''); // Esto limpiará el input 'otroMontoPago'
    }
  }
  
}