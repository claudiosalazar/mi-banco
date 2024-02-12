import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { DatosUsuarioService } from '../../../../../services/datos-usuario.service';
import { SaldosService } from '../../../../../services/saldos.service';
import { DatosUsuarioActual } from '../../../../../../assets/models/datos-usuario.model';
import { PesosPipe } from '../../../../../pipes/pesos.pipe';

@Component({
  selector: 'app-visa-pago',
  templateUrl: './visa-pago.component.html'
})
export class VisaPagoComponent implements OnInit {

  private pesosPipe = new PesosPipe();

  pagoVisaForm: FormGroup = new FormGroup({});
  saldoFinalCtaCte: any;
  saldoFinalLineaCre: any;
  saldoFinalVisa: any;
  datosUsuarioActual: DatosUsuarioActual | undefined;
  submitted = false;
  contenedorPagoTotal = false;
  contenedorOtroPago = true;
  cupoValido: boolean | undefined;
  saldoRestanteVisa: number | undefined;
  
  // Variables para datos de usuario
  visaN: any;
  visaSaldo: any | undefined;
  productoSeleccionado: any;
  elementosHabilitados = false;
  inputOtroMonto: any;

  // Variables para saldos
  


  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private saldosService: SaldosService,
  ) { }

  // Inicialización de formulario
  ngOnInit(): void {
    this.getDatosUsuario();
    this.pagoVisaForm = new FormGroup({
      productoParaPago: new FormControl('0', [Validators.required, this.validaProductoParaPago()]),
      montoPago: new FormControl({value: 'otroMonto', disabled: true}, [Validators.required]),  
      inputMontoPagoTotal: new FormControl({value: this.saldoFinalCtaCte, disabled: true}, [Validators.required]),
      inputOtroMonto: new FormControl({value: '', disabled: true}, [Validators.required, Validators.min(1), this.montoMayorACero]),
      inputEmail: new FormControl(['', [Validators.required, this.formatoEmail]]),
      radio: new FormControl(''),
    });

    this.pagoVisaForm.controls['inputOtroMonto'].valueChanges.subscribe((value) => {
      const transformedValue = this.pesosPipe.transform(value);
      this.pagoVisaForm.controls['inputOtroMonto'].setValue(transformedValue, {emitEvent: false});
    });
  }
  

  // LLamada a servicio para obtener datos de usuario
  getDatosUsuario(): void {
    this.datosUsuarioService.getDatosUsuario().subscribe(data => {
      this.datosUsuarioActual = data;
      this.saldosService.calcularSaldoCtaCte(this.datosUsuarioActual).subscribe((resultado: any) => {
        this.saldoFinalCtaCte = parseFloat(resultado);
        console.log('saldoFinalCtaCte:', this.saldoFinalCtaCte);
      });
      
      this.saldosService.calcularSaldoLineaCre(this.datosUsuarioActual).subscribe((resultado: any) => {
        this.saldoFinalLineaCre = parseFloat(resultado);
        console.log('saldoFinalLineaCre:', this.saldoFinalLineaCre);
      });
      this.saldosService.calcularSaldoVisa(this.datosUsuarioActual).subscribe((resultado: any) => {
        this.saldoFinalVisa = parseFloat(resultado);
        console.log('saldoFinalVisa:', this.saldoFinalVisa);
      });

      this.saldosService.calculaSaldoRestanteVisa(this.datosUsuarioActual).subscribe((resultado: any) => {
        this.saldoRestanteVisa = parseFloat(resultado);
        console.log('saldoRestanteVisa:', this.saldoRestanteVisa);
      });

      this.pagoVisaForm.controls['inputEmail'].setValue(this.datosUsuarioActual?.datosUsuario?.email || '');
      this.pagoVisaForm.controls['inputMontoPagoTotal'].setValue(this.pesosPipe.transform(this.saldoFinalVisa));
    });
  }

  // Valida que el en select se selecciono un producto para el pago
  validaProductoParaPago(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const isInvalid = control.value === '0';
      return isInvalid ? { 'productoInvalido': { value: control.value } } : null;
    };
  }

  // Validación de monto mayor a cero en input inputOtroMonto
  montoMayorACero(control: AbstractControl) {
    const monto = control.value;
    if (monto !== null && monto !== undefined && (monto <= 0 || monto.trim() === '$ 0')) {
      return { montoInvalido: true };
    }
    return null;
  }

  // Quita el estado disables a los radio e input de monto
  onProductoSeleccionado(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.productoSeleccionado = target.value;
    }
    this.elementosHabilitados = this.productoSeleccionado === '1' || this.productoSeleccionado === '2';
  
    // Habilitar o deshabilitar los FormControl dependiendo del valor seleccionado
    if (this.elementosHabilitados) {
      this.pagoVisaForm.controls['montoPago'].enable();
      this.pagoVisaForm.controls['inputOtroMonto'].enable();
    } else {
      this.pagoVisaForm.controls['montoPago'].disable();
      this.pagoVisaForm.controls['inputOtroMonto'].disable();
    }
  }

  // Elimina el monto ingresado en inputOtroMonto al cambiar al radio a inputMontoPagoTotal
  radioResetMontoOtroPago(event: any): void {
    const montoPagoControl = this.pagoVisaForm.get('montoPago');
    if (montoPagoControl && montoPagoControl.value === 'pagoTotal') {
      this.pagoVisaForm.controls['inputOtroMonto'].reset();
      this.pagoVisaForm.controls['inputOtroMonto'].setErrors(null);
    } else {
      this.pagoVisaForm.controls['inputOtroMonto'].setErrors(null);
    }
  }

  // Permite ingresar solo caracteres numéricos en el input
  soloNumeros(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  
  // Valida que el mail tengo un punto y al menos dos caracteres después del punto
  formatoEmail(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (value && typeof value === 'string') {
      const split = value.split('.');
      if (split.length > 1 && split[1].length >= 2) {
        return null;
      }
    }
    return { customEmail: true };
  }

  // Valida que el email este escrito correctamente
  emailValido(inputEmail: string) {
    this.pagoVisaForm.controls[inputEmail].markAsPristine();
    this.pagoVisaForm.controls[inputEmail].markAsUntouched();
    this.pagoVisaForm.controls[inputEmail].setValidators([Validators.required, this.formatoEmail]);
    this.pagoVisaForm.controls[inputEmail].updateValueAndValidity();
  }

  // Valida que el monto ingresado sea menor o igual al saldo de la cuenta corriente
  /* validarMontos(): void {
    // Crea una nueva función de validación para inputOtroMonto
    this.pagoVisaForm.controls['inputOtroMonto'].setValidators([
      Validators.required,
      Validators.min(1),
      (control: AbstractControl) => {
        const value = Number(control.value);
        if (this.saldoValueCtaCte !== undefined && this.saldoValueLineaCre !== undefined) {
          return value > this.saldoValueCtaCte || value > this.saldoValueLineaCre ? { montoInvalido: true } : null;
        }
        return null;
      }
    ]);
  
    // Crea una nueva función de validación para inputMontoPagoTotal
    this.pagoVisaForm.controls['inputMontoPagoTotal'].setValidators([
      Validators.required,
      Validators.min(1),
      (control: AbstractControl) => {
        const value = Number(control.value);
        if (this.saldoValueCtaCte !== undefined && this.saldoValueLineaCre !== undefined) {
          return value > this.saldoValueCtaCte || value > this.saldoValueLineaCre ? { montoInvalido: true } : null;
        }
        return null;
      }
    ]);

    // Actualiza el valor y la validez de los controles
    this.pagoVisaForm.controls['inputOtroMonto'].updateValueAndValidity();
    this.pagoVisaForm.controls['inputMontoPagoTotal'].updateValueAndValidity();
  }*/
  /* validarMontos(): void {
    const saldoValueCtaCte = Number(this.pagoVisaForm.controls['saldoCtaCte'].value);
    const saldoValueLineaCre = Number(this.pagoVisaForm.controls['saldoLineaCre'].value);

    console.log('saldoValueCtaCte:', saldoValueCtaCte);
    console.log('saldoValueLineaCre:', saldoValueLineaCre);
  
    this.pagoVisaForm.controls['inputOtroMonto'].setValidators([
      Validators.required, Validators.min(1),
      (control: AbstractControl) => {
        const value = Number(control.value);
        console.log('inputOtroMonto value:', value);
        return value > saldoValueCtaCte || value > saldoValueLineaCre ? { montoInvalido: true } : null;
      }
    ]);
  
    this.pagoVisaForm.controls['inputMontoPagoTotal'].setValidators([
      Validators.required,
      (control: AbstractControl) => {
        const value = Number(control.value);
        console.log('inputMontoPagoTotal value:', value);
        return value > saldoValueCtaCte || value > saldoValueLineaCre ? { montoInvalido: true } : null;
      }
    ]);
  
    this.pagoVisaForm.controls['inputOtroMonto'].updateValueAndValidity();
    this.pagoVisaForm.controls['inputMontoPagoTotal'].updateValueAndValidity();
  } */

  onSubmit(): void {
    this.submitted = true;
    console.log(this.pagoVisaForm?.value);
  }

}

