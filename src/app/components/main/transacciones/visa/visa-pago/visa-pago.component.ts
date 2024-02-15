import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { DatosUsuarioService } from '../../../../../services/datos-usuario.service';
import { SaldosService } from '../../../../../services/saldos.service';
import { DatosUsuarioActual } from '../../../../../../assets/models/datos-usuario.model';
import { PesosPipe } from '../../../../../pipes/pesos.pipe';
import { filter, map, switchMap } from 'rxjs';

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
  montoEsCero: string | undefined;
  montoSuperiorSaldoCtaCte: string | undefined;
  montoValidoCtaCte: string | undefined;
  saldoRestanteCtaCte?: number;
  saldoRestanteLineaCre?: number;

  // Variables para saldos
  inputOtroMontoVacio: boolean = false;

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
      inputOtroMonto: new FormControl({value: '', disabled: true}, [Validators.required]),
      inputEmail: new FormControl(['', [Validators.required, this.formatoEmail]]),
      radio: new FormControl(''),
    });

    // Aplica pipe pesos a inputOtroMonto
    this.pagoVisaForm.controls['inputOtroMonto'].valueChanges.subscribe((value) => {
      const transformedValue = this.pesosPipe.transform(value);
      this.pagoVisaForm.controls['inputOtroMonto'].setValue(transformedValue, {emitEvent: false});
    });

    //
    
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
  /* montoMayorACero(control: AbstractControl) {
    const monto = control.value;
    if (monto !== null && monto !== undefined && (monto <= 0 || monto.trim() === '$ 0')) {
      return { montoInvalido: true };
    }
    return null;
  } */

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


  
  validaMontoOtroMonto() {
    const productoParaPagoControl = this.pagoVisaForm.get('productoParaPago');
    const productoParaPago = productoParaPagoControl ? productoParaPagoControl.value : null;
    const inputMontoControl = this.pagoVisaForm.get('inputOtroMonto');
  
    if (productoParaPago === '1' || productoParaPago === '2') {
      if (inputMontoControl) {
        let inputMontoValue = inputMontoControl.value;
  
        // Validación 1
        if (!inputMontoValue || inputMontoValue.trim() === '') {
          const error1 = 'Error: No se ingresó ningún valor';
          console.log(error1);
        } else {
          // Convertir el valor del input a número
          inputMontoValue = inputMontoValue.replace(/\$|\.| /g, '');
          const numericInputMonto = Number(inputMontoValue);
  
          // Validación 2
          if (numericInputMonto > this.saldoFinalCtaCte && numericInputMonto > this.saldoFinalLineaCre) {
            const error2 = 'Error: El monto ingresado es mayor que los saldos finales';
            console.log(error2);
          }
  
          // Validación 3
          if (numericInputMonto <= this.saldoFinalCtaCte && numericInputMonto <= this.saldoFinalLineaCre) {
            const montoValido = 'El monto ingresado es válido';
            console.log(montoValido);
          }
        }
      }
    }
  }

  /* validaMontoOtroMonto() {
    const inputMontoControl = this.pagoVisaForm.get('inputOtroMonto');
    if (inputMontoControl) {
      setTimeout(() => {
        let inputMontoValue = inputMontoControl.value;
        inputMontoValue = inputMontoValue.replace(/\$|\.| /g, '');
        const numericInputMonto = Number(inputMontoValue);
        if (!isNaN(numericInputMonto)) {
          console.log('Valor de inputMonto:', numericInputMonto); // Imprimir el valor de inputMonto
          this.saldosService.validaMontos(numericInputMonto).subscribe(resultados => {
            console.log('Resultados del servicio:', resultados); // Imprimir los resultados del servicio
            if (resultados.montoSuperiorSaldoCtaCte && resultados.montoValidoCtaCte) {
              this.montoSuperiorSaldoCtaCte = resultados.montoSuperiorSaldoCtaCte;
              this.montoValidoCtaCte = resultados.montoValidoCtaCte;
  
              if (this.montoSuperiorSaldoCtaCte === 'error2') {
                console.log('Error: El monto ingresado es mayor que el saldo restante en la cuenta corriente');
              } else if (this.montoValidoCtaCte === 'valido') {
                console.log('El monto es válido para la cuenta corriente');
              }
            } else {
              console.log('Error: Los resultados del servicio son objetos vacíos');
            }
          });
        } else {
          console.log('Error: inputMontoValue no es un número');
        }
      });
    }
  }*/ 


  onSubmit(): void {
    this.submitted = true;
    console.log(this.pagoVisaForm?.value);
  }

}

