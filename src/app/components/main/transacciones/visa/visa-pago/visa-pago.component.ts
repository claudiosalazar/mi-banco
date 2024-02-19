import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { DatosUsuarioService } from '../../../../../services/datos-usuario.service';
import { SaldosService } from '../../../../../services/saldos.service';
import { DatosUsuarioActual } from '../../../../../../assets/models/datos-usuario.model';
import { PesosPipe } from '../../../../../pipes/pesos.pipe';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, from, lastValueFrom, map, throwError } from 'rxjs';

declare var bootstrap: any;

@Component({
  selector: 'app-visa-pago',
  templateUrl: './visa-pago.component.html'
})
export class VisaPagoComponent implements OnInit {

  @ViewChild('modalPagoVisa') modalPagoVisa: ElementRef | undefined;
  

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
  inputMontoPagoTotal: any;
  montoEsCero: string | undefined;
  montoSuperiorSaldoCtaCte: string | undefined;
  montoValidoCtaCte: string | undefined;
  saldoRestanteCtaCte?: number;
  saldoRestanteLineaCre?: number;

  // Variables para saldos
  error1: boolean = false;
  error2: boolean = false;
  error3: boolean = false;
  pagoTotalValido: boolean = false;
  montoValido: boolean = false;
  modalInstance: any;
  

  // private radioChanged = true;

  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private saldosService: SaldosService,
    private http: HttpClient,
  ) { }

  // Inicialización de formulario
  ngOnInit(): void {
    this.getDatosUsuario();
    this.pagoVisaForm = new FormGroup({
      productoParaPago: new FormControl('0', [Validators.required, this.validaProductoParaPago()]),
      montoPago: new FormControl({value: 'otroMonto', disabled: true}, [Validators.required]),  
      // inputMontoPagoTotal: new FormControl({value: this.saldoFinalCtaCte, disabled: true}, [Validators.required]),
      inputMontoPagoTotal: new FormControl({value: '', disabled: true}, [Validators.required, ]),
      inputOtroMonto: new FormControl({value: '', disabled: true}, [Validators.required]),
      inputEmail: new FormControl(['', [Validators.required, this.formatoEmail]]),
    });

    // Aplica pipe pesos a inputOtroMonto
    this.pagoVisaForm.controls['inputOtroMonto'].valueChanges.subscribe((value) => {
      const transformedValue = this.pesosPipe.transform(value);
      this.pagoVisaForm.controls['inputOtroMonto'].setValue(transformedValue, {emitEvent: false});
    });


    // Resetea validaciones de inputOtroMonto al cambiar el valor de productoParaPago
    if (this.pagoVisaForm.get('productoParaPago')) {
      this.pagoVisaForm.get('productoParaPago')?.valueChanges.subscribe(value => {
        if (value === '1' || value === '2') {
          this.resetValidacionesInputOtroMonto();
          this.pagoVisaForm.get('inputOtroMonto')?.reset();
        }
      });
    }

    if (this.modalPagoVisa) {
      this.modalInstance = new bootstrap.Modal(this.modalPagoVisa.nativeElement);
    }

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
  radioResetInput(_event: any): void {
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

  detectaCambioRadio() {
    const montoPagoControl = this.pagoVisaForm.get('montoPago');
    const inputMontoPagoTotalControl = this.pagoVisaForm.get('inputMontoPagoTotal');
  
    if (montoPagoControl) {
      montoPagoControl.valueChanges.subscribe(value => {
        if (value === 'primerRadio' && inputMontoPagoTotalControl) {
          inputMontoPagoTotalControl.updateValueAndValidity();
        }
      });
    }
  }

  validaMontoPagoTotal() {
    const productoParaPagoControl = this.pagoVisaForm.get('productoParaPago');
    const productoParaPago = productoParaPagoControl ? productoParaPagoControl.value : null;
    const inputMontoControl2 = this.pagoVisaForm.get('inputMontoPagoTotal');
  
    if (productoParaPago === '1' || productoParaPago === '2') {
      if (inputMontoControl2) {
        let inputMontoValue2 = inputMontoControl2.value;
  
        // Convertir el valor del input a número
        inputMontoValue2 = inputMontoValue2.replace(/\$|\.| /g, '');
        const numericInputMonto = Number(inputMontoValue2);
  
        // Validación 1
        if (productoParaPago === '1' && numericInputMonto <= this.saldoFinalCtaCte) {
          this.pagoTotalValido = true;
          console.log('valido');
        } 
        // Validación 2
        else if (productoParaPago === '2' && numericInputMonto <= this.saldoFinalLineaCre) {
          this.pagoTotalValido = true;
          console.log('valido');
        } 
        else {
          this.error3 = true;
          console.log('valor superior');
        }
      }
    }
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
          this.error1 = true;
          console.log('valor 0');
        } else {
          this.error1 = false;
          // Convertir el valor del input a número
          inputMontoValue = inputMontoValue.replace(/\$|\.| /g, '');
          const numericInputMonto = Number(inputMontoValue);
  
          // Validación 2
          if (numericInputMonto > this.saldoFinalCtaCte && numericInputMonto > this.saldoFinalLineaCre) {
            this.error2 = true;
            console.log('valor superior');
          } else {
            this.error2 = false;
          }
  
          // Validación 3
          if (numericInputMonto <= this.saldoFinalCtaCte && numericInputMonto <= this.saldoFinalLineaCre) {
            this.montoValido = true;
            console.log('valido');
          } else {
            this.montoValido = false;
          }
        }
      }
    }
  }

  resetValidacionesInputOtroMonto() {
    this.error1 = false;
    this.error2 = false;
    this.montoValido = false;
    // console.log('reset a otro monto');
    // Limpia el valor ingresado en inputOtroMonto
    
  }

  resetValidacionesInputPagoTotal() {
    this.error3 = false;
    this.pagoTotalValido = false;
    // console.log('reset a pago total');
    // Limpia el valor ingresado en inputOtroMonto
    
  }


  pagar() {
    this.submitted = true;
    console.log(this.pagoVisaForm?.value);
  
    if (this.pagoVisaForm.valid) {
      let monto = this.pagoVisaForm.value.inputMontoPagoTotal || this.pagoVisaForm.value.inputOtroMonto;
      monto = monto.replace(/\$|\.| /g, '');
      const montoNumber = Number(monto);
  
      if (isNaN(montoNumber)) {
        console.error('monto no es un número');
        return;
      }
  
      // Muestra el modal
      if (this.modalPagoVisa && this.modalPagoVisa.nativeElement) {
        this.modalInstance.show();
      }
  
      if (this.datosUsuarioActual !== undefined) {
        this.saldosService.calculaSaldoRestanteVisa(this.datosUsuarioActual).subscribe((resultado: any) => {
          this.saldoFinalVisa = parseFloat(resultado);
          console.log('saldoFinalVisa:', this.saldoFinalVisa);
  
          // Continúa con el resto del código de pagar aquí, dentro de la suscripción a calcularSaldoVisa
          if (this.saldoFinalVisa !== undefined) {
            console.log('saldoFinalVisa antes de la resta:', this.saldoFinalVisa); // imprime saldoFinalVisa antes de la suma
            console.log('montoNumber:', montoNumber); // imprime montoNumber
            this.saldoFinalVisa -= montoNumber;
            console.log('saldoFinalVisa después de la suma:', this.saldoFinalVisa); // imprime saldoFinalVisa después de la suma
            this.guardarPagoVisaJson(this.saldoFinalVisa).subscribe({
              next: response => console.log('Respuesta del servidor:', response),
              error: err => console.error('Error al enviar los datos:', err)
            });
          } else {
            console.error('data es undefined');
          }
        });
      } else {
        console.error('saldosService es undefined');
      }
    }
  }

  /* guardarPagoVisaJson(saldoFinalVisa: number): Observable<any> {
    const params = new HttpParams().set('saldoFinalVisa', saldoFinalVisa.toString());
    const request$ = this.http.get<any>('../../../../../../assets/data/datos-usuario.json', { params });
    return from(lastValueFrom(request$)).pipe(
      map(response => {
        const responseNumber = parseFloat(response);
        if (isNaN(responseNumber)) {
          throw new Error('La respuesta de la API no es un número');
        }
        return responseNumber;
      })
    );
  } */

  guardarPagoVisaJson(saldoFinalVisa: number): Observable<any> {
    const url = 'http://localhost:4200/assets/data/datos-usuario.json'; // Reemplaza con la URL de tu API
    const params = new HttpParams().set('saldoFinalVisa', saldoFinalVisa.toString());
  
    return this.http.get(url, { params }).pipe(
      catchError((error: any) => {
        console.error('Error al enviar los datos:', error);
        return throwError(error);
      })
    );
  }
  

}

