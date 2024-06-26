
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { PesosPipe } from '../../../../shared/pipes/pesos.pipe';
import { NumeroTarjetaPipe } from '../../../../shared/pipes/numero-tarjeta.pipe';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

// Service
import { DatosUsuarioService } from '../../../../core/services/datos-usuario.service';
import { ProductosUsuarioService } from '../../../../core/services/productos-usuario.service';
import { OfertasProductosService } from '../../../../core/services/ofertas-productos.service';
import { BackdropService } from '../../../../core/services/backdrop.service';

// Model
import { DatosUsuarioActual } from '../../../../shared/models/datos-usuario.model';

declare var bootstrap: any;

@Component({
  selector: 'app-linea-credito-pago',
  templateUrl: './linea-credito-pago.component.html',
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      state('*', style({
        opacity: 0.5
      })),
      transition('void <=> *', animate('0.2s'))
    ])
  ]
})
export class LineaCreditoPagoComponent implements OnInit, AfterViewInit {

  @ViewChild('modalPagoLineaCredito') modalPagoLineaCredito: ElementRef | undefined;

  baseUrl = 'http://localhost:3000';

  private pesosPipe = new PesosPipe();

  pagoLineaCreditoForm: FormGroup = new FormGroup({});
  
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

  mostrarBackdropCustomModal = false;
  modales: any[] = [];

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
  numeroCtaCte: any = '';
  cupoLineaCredito: any;
  numeroLineaCredito: any;
  numeroVisa: any = '';
  numeroVisaOculto: any;
  cupoInicialLineaCredito: any;
  cupoDisponibleLineaCredito: any;
  montoPagado: any;
  productoInvalido: any;

  // Variables para ofertas
  ofertasProductos: { ofertas: any[] } = { ofertas: [''] };
  montoPreAprobadoSeguroAuto: any
  datosTransaccion: any;

  // Variables para modal
  pagoCorrecto: boolean = true;
  errorServer: boolean = false;

  // Variable para custom select
  opcionesDePago = [
    { value: '0', label: '-' },
    { value: '1', label: 'Cuenta Corriente N° ' + this.numeroCtaCte },
    { value: '2', label: 'Visa N° ' + this.numeroVisa }
  ];


  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private productosUsuarioService: ProductosUsuarioService,
    private ofertasProductosService: OfertasProductosService,
    private backdropService: BackdropService,
    private http: HttpClient,
  ) { }

  // Inicialización de formulario
  ngOnInit(): void {
    this.getDatosUsuario();
    this.getOfertasProductos('')
    this.getProductosUsuarioResumen('');
    this.getDatosSelect('');
    this.pagoLineaCreditoForm = new FormGroup({
      productoParaPago: new FormControl('0', [Validators.required, this.validaProductoParaPago()]),
      montoPago: new FormControl({value: 'otroMonto', disabled: true}, [Validators.required]),
      inputMontoPagoTotal: new FormControl({value: '', disabled: true}, [Validators.required, ]),
      inputOtroMonto: new FormControl({value: '', disabled: true}, [Validators.required]),
      inputEmail: new FormControl(['', [Validators.required, this.formatoEmail]]),
    });

    // Aplica pipe pesos a inputOtroMonto
    this.pagoLineaCreditoForm.controls['inputOtroMonto'].valueChanges.subscribe((value) => {
      const transformedValue = this.pesosPipe.transform(value);
      this.pagoLineaCreditoForm.controls['inputOtroMonto'].setValue(transformedValue, {emitEvent: false});
    });


    // Resetea validaciones de inputOtroMonto al cambiar el valor de productoParaPago
    if (this.pagoLineaCreditoForm.get('productoParaPago')) {
      this.pagoLineaCreditoForm.get('productoParaPago')?.valueChanges.subscribe(value => {
        if (value === '1' || value === '2') {
          this.resetValidacionesInputOtroMonto();
          this.pagoLineaCreditoForm.get('inputOtroMonto')?.reset();
        }
      });
    }

  }

  ngAfterViewInit(): void {
    this.modales = Array.from(document.querySelectorAll('.modal')).map(el => {
      const modal = new bootstrap.Modal(el);
      el.addEventListener('show.bs.modal', () => {
        this.backdropService.show();  // Muestra el backdrop
      });
      el.addEventListener('hide.bs.modal', () => {
        this.backdropService.hide();  // Oculta el backdrop
      });
      return modal;
    });
  }

  // LLamada a servicio para obtener datos de usuario
  getDatosUsuario(): void {
    this.datosUsuarioService.getDatosUsuario().subscribe(data => {
      this.datosUsuarioActual = data;
      this.pagoLineaCreditoForm.controls['inputEmail'].setValue(this.datosUsuarioActual?.datosUsuario?.email || '');
      this.pagoLineaCreditoForm.controls['inputMontoPagoTotal'].setValue(this.pesosPipe.transform(this.cupoLineaCredito));
    });
  }

  getProductosUsuarioResumen(id: string): void {
    this.productosUsuarioService.getProductosUsuarioResumen(id).subscribe(
      data => {
        this.productosUsuario = data.productos ? { productos: data.productos } : { productos: []};
        this.cupoCtaCte = parseFloat(this.productosUsuario.productos[0]?.transacciones[this.productosUsuario.productos[0]?.transacciones.length - 1]?.saldo);
        this.numeroCtaCte = parseFloat(this.productosUsuario.productos[0]?.productoNumero);
        this.cupoLineaCredito = parseFloat(this.productosUsuario.productos[1]?.transacciones[this.productosUsuario.productos[1]?.transacciones.length - 1]?.saldo);
        this.numeroLineaCredito = parseFloat(this.productosUsuario.productos[1]?.productoNumero);
        this.numeroVisa = this.productosUsuario.productos[2]?.productoNumero;
        this.cupoInicialLineaCredito = parseFloat(this.productosUsuario.productos[1]?.cupo);
        this.cupoVisa = parseFloat(this.productosUsuario.productos[2]?.transacciones[this.productosUsuario.productos[2]?.transacciones.length - 1]?.saldo);
        this.cupoDisponibleLineaCredito = parseFloat(this.productosUsuario.productos[1]?.cupoDisponible);
      }
    );
  }

  getDatosSelect(id: string): void {
    this.productosUsuarioService.getProductosUsuarioResumen(id).subscribe(
      data => {
        this.productosUsuario = data.productos ? { productos: data.productos } : { productos: []};
        this.numeroCtaCte = this.productosUsuario.productos[0]?.productoNumero;
        this.numeroVisa = this.productosUsuario.productos[2]?.productoNumero;
        const numeroTarjetaPipe = new NumeroTarjetaPipe();
        this.opcionesDePago = [
          { value: '0', label: '-' },
          { value: '1', label: 'Cuenta Corriente N° ' + this.numeroCtaCte },
          { value: '2', label: 'Visa N° ' + numeroTarjetaPipe.transform(this.numeroVisa) }
        ];
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
  onProductoSeleccionado(value: any): void {
    this.productoSeleccionado = value;
    this.elementosHabilitados = this.productoSeleccionado === '1' || this.productoSeleccionado === '2';
  
    // Habilitar o deshabilitar los FormControl dependiendo del valor seleccionado
    if (this.elementosHabilitados) {
      this.pagoLineaCreditoForm.controls['montoPago'].enable();
      this.pagoLineaCreditoForm.controls['inputOtroMonto'].enable();
    } else {
      this.pagoLineaCreditoForm.controls['montoPago'].disable();
      this.pagoLineaCreditoForm.controls['inputOtroMonto'].disable();
    }
  }

  // Elimina el monto ingresado en inputOtroMonto al cambiar al radio a inputMontoPagoTotal
  radioResetInput(_event: any): void {
    const montoPagoControl = this.pagoLineaCreditoForm.get('montoPago');
    if (montoPagoControl && montoPagoControl.value === 'pagoTotal') {
      this.pagoLineaCreditoForm.controls['inputOtroMonto'].reset();
      this.pagoLineaCreditoForm.controls['inputOtroMonto'].setErrors(null);
    } else {
      this.pagoLineaCreditoForm.controls['inputOtroMonto'].setErrors(null);
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
    this.pagoLineaCreditoForm.controls[inputEmail].markAsPristine();
    this.pagoLineaCreditoForm.controls[inputEmail].markAsUntouched();
    this.pagoLineaCreditoForm.controls[inputEmail].setValidators([Validators.required, this.formatoEmail]);
    this.pagoLineaCreditoForm.controls[inputEmail].updateValueAndValidity();
  }

  detectaCambioRadio() {
    const montoPagoControl = this.pagoLineaCreditoForm.get('montoPago');
    const inputMontoPagoTotalControl = this.pagoLineaCreditoForm.get('inputMontoPagoTotal');
  
    if (montoPagoControl) {
      montoPagoControl.valueChanges.subscribe(value => {
        if (value === 'primerRadio' && inputMontoPagoTotalControl) {
          inputMontoPagoTotalControl.updateValueAndValidity();
        }
      });
    }
  }

  validaMontoPagoTotal() {
    const productoParaPagoControl = this.pagoLineaCreditoForm.get('productoParaPago');
    const productoParaPago = productoParaPagoControl ? productoParaPagoControl.value : null;
    const inputMontoControl2 = this.pagoLineaCreditoForm.get('inputMontoPagoTotal');
  
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
        else if (productoParaPago === '2' && numericInputMonto <= this.cupoVisa) {
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
    const productoParaPagoControl = this.pagoLineaCreditoForm.get('productoParaPago');
    const productoParaPago = productoParaPagoControl ? productoParaPagoControl.value : null;
    const inputMontoControl = this.pagoLineaCreditoForm.get('inputOtroMonto');
  
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
          if (numericInputMonto > this.cupoCtaCte && numericInputMonto > this.cupoVisa) {
            this.error2 = true;
            console.log('valor superior');
          } else {
            this.error2 = false;
          }
  
          // Validación 3
          if (numericInputMonto <= this.cupoCtaCte && numericInputMonto <= this.cupoVisa) {
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
    this.backdropService.show();
    const montoPagoControl = this.pagoLineaCreditoForm.get('montoPago');
    const inputMontoPagoTotalControl = this.pagoLineaCreditoForm.get('inputMontoPagoTotal');
    const inputOtroMontoControl = this.pagoLineaCreditoForm.get('inputOtroMonto');
    const productoParaPago = this.pagoLineaCreditoForm.get('productoParaPago');
  
    // Inicializa el error de producto inválido en false
    this.productoInvalido = false;
  
    if (productoParaPago && productoParaPago.value === '0') {
      // Si el producto seleccionado es '0', establece el error de producto inválido en true
      this.productoInvalido = true;
      return;
    } else if (montoPagoControl && inputMontoPagoTotalControl && inputOtroMontoControl && productoParaPago) {
      // Continúa con la validación del formulario si el producto seleccionado no es '0'
      if ((productoParaPago.value === '1' || productoParaPago.value === '2') && montoPagoControl.value === 'pagoTotal') {
        this.validaMontoPagoTotal();
        if (!this.error3 && montoPagoControl.value) {
          let montoPagoTotal = inputMontoPagoTotalControl.value;
          montoPagoTotal = montoPagoTotal.replace(/\$|\.| /g, '');
          this.montoNumberTotal = Number(montoPagoTotal);
          console.log('montoNumberTotal:', this.montoNumberTotal);
        }
      } else if ((productoParaPago.value === '1' || productoParaPago.value === '2') && montoPagoControl.value === 'otroMonto') {
        this.validaMontoOtroMonto();
        if (!this.error1 && !this.error2 && this.pagoLineaCreditoForm.value.inputOtroMonto) {
          let montoOtroMonto = this.pagoLineaCreditoForm.value.inputOtroMonto;
          montoOtroMonto = montoOtroMonto.replace(/\$|\.| /g, '');
          this.montoNumberOtro = Number(montoOtroMonto);
          console.log('montoNumberOtro:', this.montoNumberOtro);
        }
      }
    }
  
    // Si no hay errores, muestra el modal
    if (!this.error1 && !this.error2 && !this.error3 && !this.productoInvalido) {
      let modal = new bootstrap.Modal(document.getElementById('modalPagoLineaCredito'), {
        backdrop: 'static',
        keyboard: false
      });
      modal.show();

      this.datosPagoLineaCredito().subscribe({
        next: (datosTransaccion: any) => {
          this.productosUsuarioService.getDatosPagoLineaCredito(datosTransaccion);
          this.pagoCorrecto = true;
          setTimeout(() => {
            this.backdropService.hide();
          }, 1500);
        },
        error: (error) => {
          console.error('Error al enviar los datos al servidor:', error);
          this.pagoCorrecto = false;
          this.errorServer = true;
        }
      });
    }
  }

  calculoPagoFormulario(): any {
    const montoPagado: any = this.montoNumberTotal || this.montoNumberOtro;
    let productoParaPagoValue = this.pagoLineaCreditoForm.get('productoParaPago')?.value;
  
    if (productoParaPagoValue === '1') {
      this.cupoCtaCte -= montoPagado;
      this.cupoDisponibleLineaCredito += montoPagado;
    } else if (productoParaPagoValue === '2') {
      this.cupoVisa -= montoPagado;
      this.cupoDisponibleLineaCredito += montoPagado;
    }

    // Convertir 'montoPagado' a un string
    const montoPagadoString = montoPagado.toString();
  
    return {
      montoPagado: montoPagadoString,
      cupoLineaCredito: this.cupoLineaCredito,
      cupoDisponibleLineaCredito: this.cupoDisponibleLineaCredito,
      cupoCtaCte: this.cupoCtaCte,
      cupoVisa: this.cupoVisa,
      productoParaPagoValue: productoParaPagoValue
    };
  }

  datosPagoLineaCredito(): Observable<any> {

    // Llama al metodo calculo y obtiene los valores
    const result = this.calculoPagoFormulario();

    // Obtener la fecha
    const datePipe = new DatePipe('en-US');
    const fecha = new Date();
    const fechaFormateada = datePipe.transform(fecha, 'yyyy-MM-dd');

    let montoPagado = result.montoPagado;
    let cupoCtaCte = result.cupoCtaCte;
    let cupoVisa = result.cupoVisa;
    let cupoLineaCredito= result.cupoLineaCredito;
    let cupoDisponibleLineaCredito = result.cupoDisponibleLineaCredito;

    // Hacer una petición GET para obtener los datos del archivo productos-usuario.json
    return this.http.get(this.baseUrl + '/backend/data/productos-usuario.json').pipe(map((res: any) => {
      // Los datos del archivo están en 'res'
      const datosTransaccion = res;
      const productoCtaCte = datosTransaccion.productos.find((productos: { id: string; }) => productos.id === '0');
      const productoLineaCredito = datosTransaccion.productos.find((productos: { id: string; }) => productos.id === '1');
      const productoVisa = datosTransaccion.productos.find((productos: { id: string; }) => productos.id === '2');


      if (result.productoParaPagoValue === '1') {
        // Datos Cuenta Corriente
        if (productoCtaCte) {
          const cupoCtaCteString = cupoCtaCte.toString();

          // Si el producto existe, agregar las variables y la nueva transacción
          productoCtaCte.cupo = cupoCtaCteString;

          // Obtener el último ID en el array de transacciones
          const ultimoIdTransaccion = Math.max(...productoCtaCte.transacciones.map((t: { id: string; }) => parseInt(t.id)), 0);

          // Generar un nuevo ID que sea el siguiente al último ID existente
          const nuevoIdTransaccion = ultimoIdTransaccion + 1;

          // Crear una nueva transacción con el nuevo ID y el monto pagado
          productoCtaCte.transacciones.push({
            id: nuevoIdTransaccion.toString(),
            fecha: fechaFormateada, // Usar la fecha formateada
            detalle: 'Pago a LineaCredito',
            cargo: montoPagado,
            abono: '0',
            saldo: '' // Reemplaza con el valor real
          });
        }

      } else if (result.productoParaPagoValue === '2') {
        // Datos Linea de credito
        if (productoVisa) {
          const cupoVisaString = cupoVisa.toString();

          // Si el producto existe, agregar las variables y la nueva transacción
          productoVisa.cupo = cupoVisaString;

          // Obtener el último ID en el array de transacciones
          const ultimoIdTransaccion = Math.max(...productoVisa.transacciones.map((t: { id: string; }) => parseInt(t.id)), 0);

          // Generar un nuevo ID que sea el siguiente al último ID existente
          const nuevoIdTransaccion = ultimoIdTransaccion + 1;

          // Crear una nueva transacción con el nuevo ID y el monto pagado
          productoVisa.transacciones.push({
            id: nuevoIdTransaccion.toString(),
            fecha: fechaFormateada, // Usar la fecha formateada
            detalle: 'Pago a LineaCredito',
            cargo: montoPagado,
            abono: '0',
            saldo: '' // Reemplaza con el valor real
          });
        }
        
      }
      if (productoLineaCredito && productoLineaCredito.id === '1') {
        const cupoLineaCreditoString = cupoLineaCredito.toString();
        const cupoDisponibleLineaCreditoString = cupoDisponibleLineaCredito.toString();
      
        // Si el producto existe, agregar las variables y la nueva transacción
        productoLineaCredito.cupo = cupoLineaCreditoString;
        productoLineaCredito.cupoDisponible = cupoDisponibleLineaCreditoString;
      
        // Obtener el último ID en el array de transacciones
        const ultimoIdTransaccion = Math.max(...productoLineaCredito.transacciones.map((t: { id: string; }) => parseInt(t.id)), 0);
      
        // Generar un nuevo ID que sea el siguiente al último ID existente
        const nuevoIdTransaccion = ultimoIdTransaccion + 1;
      
        // Crear una nueva transacción con el nuevo ID y el monto pagado
        productoLineaCredito.transacciones.push({
          id: nuevoIdTransaccion.toString(),
          fecha: fechaFormateada, // Usar la fecha formateada
          detalle: 'Abono a Línea de Crédito',
          cargo: '0',
          abono: montoPagado,
          saldo: '' // Reemplaza con el valor real
        });
      }
      // Imprimir la estructura de datos enviadas en la consola
      console.log('Datos que se van a enviar:', JSON.stringify(datosTransaccion));
      return JSON.stringify(datosTransaccion);
      })
    );
  }

}

