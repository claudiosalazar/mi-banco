import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { SaldosService } from '../../../../core/services/saldos.service';
import { PesosPipe } from '../../../../shared/pipes/pesos.pipe';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

// Datos usuario
import { DatosUsuarioService } from '../../../../core/services/datos-usuario.service';
import { DatosUsuarioActual } from '../../../../shared/models/datos-usuario.model';
// Productos usuario
import { ProductosUsuarioService } from '../../../../core/services/productos-usuario.service';
import { ProductosUsuario } from '../../../../shared/models/productos-usuario.model';
// Datos ofertas
import { OfertasProductosService } from '../../../../core/services/ofertas-productos.service';
import { OfertasProductos } from './../../../../shared/models/ofertas-productos.model';

declare var bootstrap: any;

@Component({
  selector: 'app-visa-pago',
  templateUrl: './visa-pago.component.html'
})
export class VisaPagoComponent implements OnInit {

  @ViewChild('modalPagoVisa') modalPagoVisa: ElementRef | undefined;
  
  // private urlData = '../../../../../../assets/data/datos-usuario.json';

  private pesosPipe = new PesosPipe();

  pagoVisaForm: FormGroup = new FormGroup({});



  // saldo: number | undefined;
  disponible: number | undefined;
  saldoCtaCte: any;
  saldoLineaCre: any;
  saldoVisa: any;
  disponibleVisa: any;
  disponibleCtaCte: any;
  disponibleLineaCre: any;

  datosUsuarioActual: DatosUsuarioActual | undefined;
  submitted = false;
  contenedorPagoTotal = false;
  contenedorOtroPago = true;
  cupoValido: boolean | undefined;
  // saldoRestanteVisa: number | undefined;
  
  // Variables para datos de usuario
  //visaN: any;
  //visaSaldo: any | undefined;
  productoSeleccionado: any;
  elementosHabilitados = false;
  inputOtroMonto: any;
  inputMontoPagoTotal: any;
  montoEsCero: string | undefined;
  montoSuperiorSaldoCtaCte: string | undefined;
  montoValidoCtaCte: string | undefined;

  // Variables para saldos
  error1: boolean = false;
  error2: boolean = false;
  error3: boolean = false;
  pagoTotalValido: boolean = false;
  montoValido: boolean = false;
  modalInstance: any;

  montoNumberTotal: number | undefined;
  montoNumberOtro: number | undefined;

  productosUsuario: ProductosUsuario | undefined;

  // private radioChanged = true;

  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private productosUsuarioService: ProductosUsuarioService,
    private ofertasProductosService: OfertasProductosService,
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

      /*
      // Captura calculos de Cuenta Corriente
      this.saldosService.calcularSaldoCtaCte(this.datosUsuarioActual).subscribe((saldoCtaCte: any) => {
        this.saldoCtaCte = parseFloat(saldoCtaCte);
        console.log('Saldo Cta Cte:', this.saldoCtaCte);
      });

      this.saldosService.calcularDisponibleCtaCte(this.datosUsuarioActual).subscribe((disponibleCtaCte: any) => {
        this.disponibleCtaCte = parseFloat(disponibleCtaCte);
        console.log('Disponible Cta Cte:', this.disponibleCtaCte);
      });

      // Captura calculos de Linea de Credito
      this.saldosService.calcularSaldoLineaCre(this.datosUsuarioActual).subscribe((saldoLineaCre: any) => {
        this.saldoLineaCre = parseFloat(saldoLineaCre);
        console.log('Saldo Linea Credito:', this.saldoLineaCre);
      });

      this.saldosService.calcularDisponibleLineaCre(this.datosUsuarioActual).subscribe((disponibleLineaCre: any) => {
        this.disponibleLineaCre = parseFloat(disponibleLineaCre);
        console.log('Disponible Linea Credito:', this.disponibleLineaCre);
      });
      
      // Captura calculos de Visa
      this.saldosService.calcularSaldoVisa(this.datosUsuarioActual).subscribe((saldoVisa: any) => {
        this.saldoVisa = parseFloat(saldoVisa);
        console.log('Saldo Visa:', this.saldoVisa);
      });

      this.saldosService.calcularDisponibleVisa(this.datosUsuarioActual).subscribe((disponibleVisa: any) => {
        this.disponibleVisa = parseFloat(disponibleVisa);
        console.log('Disponible Visa:', this.disponibleVisa);
      });
      */

      this.pagoVisaForm.controls['inputEmail'].setValue(this.datosUsuarioActual?.datosUsuario?.email || '');
      this.pagoVisaForm.controls['inputMontoPagoTotal'].setValue(this.pesosPipe.transform(this.saldoVisa));
    });
  }

  getProductosUsuario(): void {
    /* this.productosUsuarioService.getProductosUsuario().subscribe(data => {
      this.productosUsuario = data;
      this.saldoCtaCte =  this.productosUsuario.productos[0].transacciones.reduce((acc, transaccion) => acc + transaccion, 0);
      this.saldoLineaCre =  this.productosUsuario.productos[1].transacciones.reduce((acc, transaccion) => acc + transaccion, 0);
      this.saldoVisa =  this.productosUsuario.productos[2].transacciones.reduce((acc, transaccion) => acc + transaccion, 0);
      // this.saldoLineaCre = this.saldosService.calcularSaldoLineaCre(this.datosUsuarioActual);
      // this.saldoVisa = this.saldosService.calcularSaldoVisa(this.datosUsuarioActual);
    }); */
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
        // if (productoParaPago === '1' && numericInputMonto <= this.saldo) {
        if (productoParaPago === '1' && numericInputMonto <= this.saldoCtaCte) {
          this.pagoTotalValido = true;
          console.log('valido');
        } 
        // Validación 2
        else if (productoParaPago === '2' && numericInputMonto <= this.saldoLineaCre) {
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
          if (numericInputMonto > this.saldoCtaCte && numericInputMonto > this.saldoLineaCre) {
            this.error2 = true;
            console.log('valor superior');
          } else {
            this.error2 = false;
          }
  
          // Validación 3
          if (numericInputMonto <= this.saldoCtaCte && numericInputMonto <= this.saldoLineaCre) {
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

  validaFormulario(): void {
    this.submitted = true;

    console.log(this.pagoVisaForm?.value);

    const montoPagoControl = this.pagoVisaForm.get('montoPago');
    const inputMontoPagoTotalControl = this.pagoVisaForm.get('inputMontoPagoTotal');
    const inputOtroMontoControl = this.pagoVisaForm.get('inputOtroMonto');
  
    if (montoPagoControl && inputMontoPagoTotalControl && inputOtroMontoControl) {
      if (montoPagoControl.value === 'pagoTotal') {
        this.validaMontoPagoTotal();
        if (this.error3) {
        } else {
          // Se captura el dato ingreado en el input y se transforma en un dato number
          let montoPagoTotalControl = this.pagoVisaForm.get('inputMontoPagoTotal');
          if (montoPagoTotalControl) {
            let montoPagoTotal = montoPagoTotalControl.value;
            montoPagoTotal = montoPagoTotal.replace(/\$|\.| /g, '');
            this.montoNumberTotal = Number(montoPagoTotal);
            console.log('montoNumberTotal:', this.montoNumberTotal);
            this.calculosMontos();
          }
        }
      } else if (montoPagoControl.value === 'otroMonto') {
        this.validaMontoOtroMonto();
        if (this.error1 || this.error2) {
        } else {
          // Se captura el dato ingreado en el input y se transforma en un dato number
          let montoOtroMonto = this.pagoVisaForm.value.inputOtroMonto;
          montoOtroMonto = montoOtroMonto.replace(/\$|\.| /g, '');
          this.montoNumberOtro = Number(montoOtroMonto);
          console.log('montoNumberOtro:', this.montoNumberOtro);
          this.calculosMontos();
        }
      }
    }
  }

  calculosMontos() {

  }

  /* calculosMontos() {
    // Calculo de montos restantes
    if (this.datosUsuarioActual !== undefined) {
      this.saldosService.calculaSaldoRestanteVisa(this.datosUsuarioActual).subscribe((resultado: any) => {
        // Captura el dato de saldoFinalVisa y lo transforma en un dato number
        this.saldoFinalVisa = parseFloat(resultado);
        console.log('saldoFinalVisa:', this.saldoFinalVisa);

        if (this.saldoFinalVisa !== undefined && this.montoNumberTotal !== undefined) {
          console.log('saldoFinalVisa antes de la resta:', this.saldoFinalVisa); // imprime saldoFinalVisa antes de la suma
          this.saldoFinalVisa -= this.montoNumberTotal;
          this.saldoFinalCtaCte -= this.montoNumberTotal;
          this.saldoFinalLineaCre -= this.montoNumberTotal;
          console.log('saldoFinalVisa después de la suma:', this.saldoFinalVisa); // imprime saldoFinalVisa después de la suma
          this.guardarPagoVisaJson(this.saldoFinalVisa).subscribe({
            next: response => console.log('Respuesta del servidor:', response),
            error: err => console.error('Error al enviar los datos:', err)
          });
        } else {
          console.error('data es undefined');
        } if (this.saldoFinalVisa !== undefined && this.montoNumberOtro !== undefined) {
          console.log('saldoFinalVisa antes de la resta:', this.saldoFinalVisa); // imprime saldoFinalVisa antes de la suma
          this.saldoFinalVisa -= this.montoNumberOtro;
          this.saldoFinalCtaCte -= this.montoNumberOtro;
          this.saldoFinalLineaCre -= this.montoNumberOtro;
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
  } */


  /* guardarPagoVisaJson(saldoFinalVisa: number): Observable<any> {
    const url = this.urlData;
    const params = new HttpParams().set('saldoFinalVisa', saldoFinalVisa.toString());
  
    return this.http.get(url, { params }).pipe(
      catchError((error: any) => {
        console.error('Error al enviar los datos:', error);
        return throwError(error);
      })
    );
  } */

}

