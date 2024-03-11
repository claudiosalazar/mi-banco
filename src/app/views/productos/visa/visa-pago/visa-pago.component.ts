
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { PesosPipe } from '../../../../shared/pipes/pesos.pipe';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

// Datos usuario
import { DatosUsuarioService } from '../../../../core/services/datos-usuario.service';
import { DatosUsuarioActual } from '../../../../shared/models/datos-usuario.model';
// Productos usuario
import { ProductosUsuarioService } from '../../../../core/services/productos-usuario.service';
// Datos ofertas
import { OfertasProductosService } from '../../../../core/services/ofertas-productos.service';
import { DatePipe } from '@angular/common';
import { Observable, from, map } from 'rxjs';

declare var bootstrap: any;

@Component({
  selector: 'app-visa-pago',
  templateUrl: './visa-pago.component.html'
})
export class VisaPagoComponent implements OnInit {

  @ViewChild('modalPagoVisa') modalPagoVisa: ElementRef | undefined;

  private pesosPipe = new PesosPipe();

  pagoVisaForm: FormGroup = new FormGroup({});
  
  datosUsuarioActual: DatosUsuarioActual | undefined;
  submitted = false;
  contenedorPagoTotal = false;
  contenedorOtroPago = true;
  cupoValido: boolean | undefined;
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

  productosUsuario: { productos: any[] } = { productos: [] };
  cupoVisa: any;
  cupoCtaCte: any;
  numeroCtaCte: any;
  cupoLineaCredito: any;
  numeroLineaCredito: any;
  numeroVisa: any;
  cupoInicialVisa: any;
  cupoDisponibleVisa: any;
  montoPagado: any;

  // Variables para ofertas
  ofertasProductos: { ofertas: any[] } = { ofertas: [''] };
  montoPreAprobadoSeguroAuto: any
  datosPago: any;

  // Variables para modal
  pagoCorrecto: boolean = true;
  errorServer: boolean = false;

  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private productosUsuarioService: ProductosUsuarioService,
    private ofertasProductosService: OfertasProductosService,
    private http: HttpClient,
  ) { }

  // Inicialización de formulario
  ngOnInit(): void {
    this.getDatosUsuario();
    this.getOfertasProductos('')
    this.getProductosUsuarioResumen('');
    this.pagoVisaForm = new FormGroup({
      productoParaPago: new FormControl('0', [Validators.required, this.validaProductoParaPago()]),
      montoPago: new FormControl({value: 'otroMonto', disabled: true}, [Validators.required]),
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
      this.pagoVisaForm.controls['inputEmail'].setValue(this.datosUsuarioActual?.datosUsuario?.email || '');
      this.pagoVisaForm.controls['inputMontoPagoTotal'].setValue(this.pesosPipe.transform(this.cupoVisa));
    });
  }

  getProductosUsuarioResumen(id: string): void {
    this.productosUsuarioService.getProductosUsuarioResumen(id).subscribe(
      data => {
        this.productosUsuario = data.productos ? { productos: data.productos } : { productos: [] };
        this.cupoCtaCte = parseFloat(this.productosUsuario.productos[0]?.transacciones[this.productosUsuario.productos[0]?.transacciones.length - 1]?.saldo);
        this.numeroCtaCte = parseFloat(this.productosUsuario.productos[0]?.productoNumero);
        this.cupoLineaCredito = parseFloat(this.productosUsuario.productos[1]?.transacciones[this.productosUsuario.productos[1]?.transacciones.length - 1]?.saldo);
        this.numeroLineaCredito = parseFloat(this.productosUsuario.productos[1]?.productoNumero);
        this.numeroVisa = this.productosUsuario.productos[2]?.productoNumero;
        this.cupoInicialVisa = parseFloat(this.productosUsuario.productos[2]?.cupo);
        this.cupoVisa = parseFloat(this.productosUsuario.productos[2]?.transacciones[this.productosUsuario.productos[2]?.transacciones.length - 1]?.saldo);
        this.cupoDisponibleVisa = parseFloat(this.productosUsuario.productos[2]?.cupoDisponible);
      }
    );
  }

  getOfertasProductos(id: string): void {
    this.ofertasProductosService.getOfertasProductos(id).subscribe(data => {
      this.ofertasProductos = data.ofertas ? { ofertas: data.ofertas } : { ofertas: [] };
      this.montoPreAprobadoSeguroAuto = this.ofertasProductos.ofertas[1].montoPreAprobado;
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
        if (productoParaPago === '1' && numericInputMonto <= this.cupoCtaCte) {
          this.pagoTotalValido = true;
          console.log('valido');
        } 
        // Validación 2
        else if (productoParaPago === '2' && numericInputMonto <= this.cupoLineaCredito) {
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
          if (numericInputMonto > this.cupoCtaCte && numericInputMonto > this.cupoLineaCredito) {
            this.error2 = true;
            console.log('valor superior');
          } else {
            this.error2 = false;
          }
  
          // Validación 3
          if (numericInputMonto <= this.cupoCtaCte && numericInputMonto <= this.cupoLineaCredito) {
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
    // Limpia el valor ingresado en inputOtroMonto
    this.error1 = false;
    this.error2 = false;
    this.montoValido = false;
  }

  resetValidacionesInputPagoTotal() {
    // Limpia el valor ingresado en inputOtroMonto
    this.error3 = false;
    this.pagoTotalValido = false;
  }

  validaFormulario(): any {
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
        }
      }
    }

    // Si no hay errores, muestra el modal
    if (!this.error1 && !this.error2 && !this.error3) {
      let modal = new bootstrap.Modal(document.getElementById('modalPagoVisa'), {
        backdrop: 'static',
        keyboard: false
      });
      modal.show();
    
      this.datosPagoVisa().subscribe((datosPago: any) => {
        this.productosUsuarioService.getDatosPagoVisa(datosPago);
        this.pagoCorrecto = true;
        setTimeout(() => {
          modal.hide();
        }, 1500);
      }, error => {
        console.error('Error al enviar los datos al servidor:', error);
        this.pagoCorrecto = false;
        this.errorServer = true;
        modal.hide();
      });
    }
  }

  calculoPagoFormulario(): any {
    const montoPagado: any = this.montoNumberTotal || this.montoNumberOtro;
    let productoParaPagoValue = this.pagoVisaForm.get('productoParaPago')?.value;
  
    if (productoParaPagoValue === '1') {
      this.cupoCtaCte -= montoPagado;
      this.cupoVisa -= montoPagado;
      this.cupoDisponibleVisa += montoPagado;
    } else if (productoParaPagoValue === '2') {
      this.cupoLineaCredito -= montoPagado;
      this.cupoVisa -= montoPagado;
      this.cupoDisponibleVisa += montoPagado;
    }

    // Convertir 'montoPagado' a un string
    const montoPagadoString = montoPagado.toString();
  
    return {
      montoPagado: montoPagadoString,
      cupoVisa: this.cupoVisa,
      cupoDisponibleVisa: this.cupoDisponibleVisa,
      cupoCtaCte: this.cupoCtaCte,
      cupoLineaCredito: this.cupoLineaCredito,
      productoParaPagoValue: productoParaPagoValue
    };
  }

  datosPagoVisa(): Observable<any> {

    // Llama al metodo calculo y obtiene los valores
    const result = this.calculoPagoFormulario();

    // Obtener la fecha
    const datePipe = new DatePipe('en-US');
    const fecha = new Date();
    const fechaFormateada = datePipe.transform(fecha, 'yyyy-MM-dd');

    let montoPagado = result.montoPagado;
    let cupoCtaCte = result.cupoCtaCte;
    // let cupoDisponibleCtaCte = result.cupoDisponibleVisa;
    let cupoLineaCredito = result.cupoLineaCredito;
    let cupoVisa = result.cupoVisa;
    let cupoDisponibleVisa = result.cupoDisponibleVisa;

    // Hacer una petición GET para obtener los datos del archivo productos-usuario.json
    return from(this.http.get('http://localhost:3000/backend/data/productos-usuario.json').toPromise()).pipe(map((res: any) => {
        // Los datos del archivo están en 'res'
      const datosPago = res;
      const productoCtaCte = datosPago.productos.find((producto: { id: string; }) => producto.id === '0');
      const productoLineaCredito = datosPago.productos.find((producto: { id: string; }) => producto.id === '1');
      const productoVisa = datosPago.productos.find((producto: { id: string; }) => producto.id === '2');


      if (result.productoParaPagoValue === '1') {
        // Datos Cuenta Corriente
        if (productoCtaCte) {
          // Convertir 'montoPagado', 'cupoVisa' y 'cupoDisponibleVisa' a strings
          const cupoCtaCteString = cupoCtaCte.toString();
          // const cupoDisponibleCtaCteString = cupoDisponibleCtaCte.toString();

          // Si el producto existe, agregar las variables y la nueva transacción
          productoCtaCte.cupo = cupoCtaCteString;
          // productoVisa.cupoDisponible = cupoDisponibleCtaCteString;

          // Obtener el último ID en el array de transacciones
          const ultimoIdTransaccion = Math.max(...productoCtaCte.transacciones.map((t: { id: string; }) => parseInt(t.id)), 0);

          // Generar un nuevo ID que sea el siguiente al último ID existente
          const nuevoIdTransaccion = ultimoIdTransaccion + 1;

          // Crear una nueva transacción con el nuevo ID y el monto pagado
          productoCtaCte.transacciones.push({
            id: nuevoIdTransaccion.toString(),
            fecha: fechaFormateada, // Usar la fecha formateada
            detalle: 'Pago a Visa',
            cargo: montoPagado,
            abono: '',
            saldo: '' // Reemplaza con el valor real
          });
        }

      } else if (result.productoParaPagoValue === '2') {
        // Datos Linea de credito
        if (productoLineaCredito) {
          // Convertir 'montoPagado', 'cupoVisa' y 'cupoDisponibleVisa' a strings
          const cupoLineaCreditoString = cupoLineaCredito.toString();
          // const cupoDisponibleCtaCteString = cupoDisponibleCtaCte.toString();

          // Si el producto existe, agregar las variables y la nueva transacción
          productoLineaCredito.cupo = cupoLineaCreditoString;
          // productoVisa.cupoDisponible = cupoDisponibleCtaCteString;

          // Obtener el último ID en el array de transacciones
          const ultimoIdTransaccion = Math.max(...productoLineaCredito.transacciones.map((t: { id: string; }) => parseInt(t.id)), 0);

          // Generar un nuevo ID que sea el siguiente al último ID existente
          const nuevoIdTransaccion = ultimoIdTransaccion + 1;

          // Crear una nueva transacción con el nuevo ID y el monto pagado
          productoLineaCredito.transacciones.push({
            id: nuevoIdTransaccion.toString(),
            fecha: fechaFormateada, // Usar la fecha formateada
            detalle: 'Pago a Visa',
            cargo: montoPagado,
            abono: '',
            saldo: '' // Reemplaza con el valor real
          });
        }
        
      }
      if (productoVisa && productoVisa.id === '2') {
        // Convertir 'montoPagado', 'cupoVisa' y 'cupoDisponibleVisa' a strings
        const cupoVisaString = cupoVisa.toString();
        const cupoDisponibleVisaString = cupoDisponibleVisa.toString();
      
        // Si el producto existe, agregar las variables y la nueva transacción
        productoVisa.cupo = cupoVisaString;
        productoVisa.cupoDisponible = cupoDisponibleVisaString;
      
        // Obtener el último ID en el array de transacciones
        const ultimoIdTransaccion = Math.max(...productoVisa.transacciones.map((t: { id: string; }) => parseInt(t.id)), 0);
      
        // Generar un nuevo ID que sea el siguiente al último ID existente
        const nuevoIdTransaccion = ultimoIdTransaccion + 1;
      
        // Crear una nueva transacción con el nuevo ID y el monto pagado
        productoVisa.transacciones.push({
          id: nuevoIdTransaccion.toString(),
          fecha: fechaFormateada, // Usar la fecha formateada
          detalle: 'Abono a Visa',
          cargo: '',
          abono: montoPagado,
          saldo: '' // Reemplaza con el valor real
        });
      }
      // Imprimir la estructura de datos enviadas en la consola
      // console.log('Estructura de datos enviadas:', datosPago);
      // console.log('Datos que se van a enviar:', JSON.stringify(datosPago));
      return JSON.stringify(datosPago);
      })
    );
    /*
    // Enviar los datos
    this.http.post('ruta/a/servidor', datosString).subscribe((res: any) => {
      console.log('Los datos se enviaron correctamente:', res);
    }, (error: HttpErrorResponse) => {
      console.log('Hubo un error al enviar los datos:', error);
    });
    */
  }

}

