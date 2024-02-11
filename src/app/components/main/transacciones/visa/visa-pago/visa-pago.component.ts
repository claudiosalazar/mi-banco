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
  saldoCtaCte: any;
  saldoLineaCre: any;
  saldoVisa: any;
  datosUsuarioActual: DatosUsuarioActual | undefined;
  submitted = false;
  contenedorPagoTotal = false;
  contenedorOtroPago = true;
  cupoValido: boolean | undefined;
  
  // Variables para datos de usuario
  visaN: any;
  visaSaldo: any | undefined;
  cupoUtilizadoVisa: any;
  productoSeleccionado: any;
  elementosHabilitados = false;


  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private montosUsuarioService: DatosUsuarioService,
    private saldosService: SaldosService,
  ) { }

  // Inicialización de formulario
  ngOnInit(): void {
    this.getDatosUsuario();
    this.pagoVisaForm = new FormGroup({
      productoParaPago: new FormControl('0', [Validators.required, this.validaProductoParaPago()]),
      montoPago: new FormControl({value: 'otroMonto', disabled: true}, [Validators.required]),  
      inputMontoPagoTotal: new FormControl({value: this.cupoUtilizadoVisa, disabled: true}, [Validators.required]),
      inputOtroMonto: new FormControl({value: '', disabled: true}, [Validators.required, this.montoMayorACero]),
      inputEmail: new FormControl(['', [Validators.required, this.customEmailValidator]]),
      radio: new FormControl(''),
    });

    // Se llama a la function onInputOtroMontoPipe para aplicar el pipe el input inputOtroMonto
    this.pagoVisaForm.controls['inputOtroMonto'].valueChanges.subscribe(value => {
      this.onInputOtroMontoPipe(value);
    });
  }
  

  // LLamada a servicio para obtener datos de usuario
  getDatosUsuario(): void {
    this.datosUsuarioService.getDatosUsuario().subscribe(data => {
      this.datosUsuarioActual = data;
      this.saldoCtaCte = this.saldosService.calcularSaldoCtaCte(this.datosUsuarioActual);
      this.saldoLineaCre = this.saldosService.calcularSaldoLineaCre(this.datosUsuarioActual);
      this.saldoVisa = this.saldosService.calcularSaldoVisa(this.datosUsuarioActual);
      this.cupoUtilizadoVisa = this.saldosService.calcularDiferenciaVisa(this.datosUsuarioActual);
      this.pagoVisaForm.controls['inputEmail'].setValue(this.datosUsuarioActual?.datosUsuario?.email || '');
      this.pagoVisaForm.controls['inputMontoPagoTotal'].setValue(this.pesosPipe.transform(this.cupoUtilizadoVisa));
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
  
  // Aplica el pipe pesos al ingresar un numero en el input inputOtroMonto
  onInputOtroMontoPipe(value: any): void {
    const transformedValue = this.pesosPipe.transform(value);
    this.pagoVisaForm.controls['inputOtroMonto'].setValue(transformedValue, {emitEvent: false});
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

  
  

  /* ngOnInit(): void {
    this.pagoVisaForm.controls['radio'].valueChanges.subscribe((value) => {
      if (value === 'checkMontoPagoTotal') {
        const transformedValue = this.pesosPipe.transform(this.cupoUtilizadoVisa);
        this.pagoVisaForm.controls['inputMontoPagoTotal'].setValue(transformedValue);
      } else {
        this.pagoVisaForm.controls['inputMontoPagoTotal'].reset();
        this.pagoVisaForm.controls['inputOtroMonto'].reset();
      }
    });
    this.pagoVisaForm.controls['inputOtroMonto'].valueChanges.subscribe((value) => {
      const transformedValue = this.pesosPipe.transform(value);
      this.pagoVisaForm.controls['inputOtroMonto'].setValue(transformedValue, {emitEvent: false});
    });
  }
  getMontosUsuario(): void {
    this.montosUsuarioService.getDatosUsuario().subscribe(data => {
      this.datosUsuarioActual = data;
    });
  }


  validarMonto(): void {
    let montoPagoTotal = Number(this.pagoVisaForm.controls['inputMontoPagoTotal'].value);
    let seleccion = this.pagoVisaForm.controls['productoParaPago'].value;
  
    let esMontoValido;
    if (seleccion === '1') {
      esMontoValido = montoPagoTotal <= this.saldoCtaCte;
    } else if (seleccion === '2') {
      esMontoValido = montoPagoTotal <= this.saldoLineaCre;
    }
  
    if (esMontoValido) {
      console.log('El monto es válido.');
    } else {
      console.log('El monto es inválido.');
    }
  }
  */

  // Permite ingresar solo caracteres numéricos en el input
  soloNumeros(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  
  // Valida input Email
  customEmailValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (value && typeof value === 'string') {
      const split = value.split('.');
      if (split.length > 1 && split[1].length >= 2) {
        return null;
      }
    }
    return { customEmail: true };
  }

  onSubmit(): void {
    this.submitted = true;
    console.log(this.pagoVisaForm?.value);
  }

}

