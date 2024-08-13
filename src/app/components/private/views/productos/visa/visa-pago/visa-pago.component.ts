import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { DatosUsuarioService } from '../../../../../../services/datosUsuario.service';
import { ProductosService } from '../../../../../../services/productos.service';
import { TransaccionesService } from '../../../../../../services/transacciones.service';
import { BackdropService } from './../../../../../../services/backdrop.service';
import { LineaCredito } from '../../../../../../models/linea-credito.model';
import { CuentaCorriente } from './../../../../../../models/cuenta-corriente.model';
import { DatosUsuario } from '../../../../../../models/datos-usuario.model';
import { Visa } from '../../../../../../models/visa.model';
import { Productos } from '../../../../../../models/productos.model';
import { FormatoEmailService } from '../../../../../../services/formatoEmail.service';
import { UrlBrowserService } from '../../../../../../services/urlBrowser.service';

// Pipes
import { NumeroTarjetaPipe } from '../../../../../../shared/pipes/numero-tarjeta.pipe';
import { PesosPipe } from './../../../../../../shared/pipes/pesos.pipe';
import { DatePipe } from '@angular/common';
import { delay, Observable, of } from 'rxjs';

declare var bootstrap: any;

@Component({
  selector: 'mb-visa-pago',
  templateUrl: './visa-pago.component.html',
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
export class VisaPagoComponent implements OnInit {

  @ViewChild('modalPagoVisa') modalPagoVisa: ElementRef | undefined;
  @ViewChild('modalCancelarPago') modalCancelarPago: ElementRef | undefined;
  @Output() cancelacionConfirmada = new EventEmitter<void>();

  productos: Productos[] = [];
  usuario: DatosUsuario[] = [];
  transaccionesLineaCre: LineaCredito[] = [];
  transaccionesCtaCte: CuentaCorriente[] = [];
  transaccionesVisa: string[] = [];
  pagoVisaForm: FormGroup = new FormGroup({});
  saldoUltimaTransaccionVisa: number | undefined;
  saldoUltimaTransaccionCtaCte: number | undefined;
  saldoUltimaTransaccionLineaCredito: number | undefined;
  cupoUsadoUltimaTransaccionLineaCredito: number | undefined;
  cupoUsadoUltimaTransaccionVisa: number | undefined;
  cupoUltimaTransaccionVisa: number | undefined;
  montoPagado: any;
  productoInvalido: any;
  montoNumberTotal: number | undefined;
  montoNumberMinimo: number | undefined;
  montoNumberOtro: number | undefined;
  email: any;
  numero_cta_cte: string | null = null;
  numero_linea_credito: string | null = null;

  private pesosPipe = new PesosPipe();
  
  // Variables para el select
  opcionesDePago: { value: string, label: string }[] = [
    { value: '0', label: '-' },
  ];
  productoSeleccionado: any;
  elementosHabilitados = false;

  submitted = false;

  // Variables para saldos
  error1: boolean = false;
  error2: boolean = false;
  error3: boolean = false;
  error4: boolean = false;
  pagoTotalValido: boolean = false;
  pagoMinimoValido: boolean = false;
  montoValido: boolean = false;
  

  // Variables para modal
  pagoCorrecto: boolean = true;
  errorServer: boolean = false;

  mostrarBackdropCustomModal = false;
  modales: any[] = [];

  saldo: any;
  abono: any;
  cupo: any;
  saldoCtaCte: any;
  saldoLineaCredito: any;
  cupoLineaCredito: any;

  nombreCuenta: string | undefined;
  datosTransaccion: any = {};

  montoFacturado = '';
  montoPagoMinimo = '';

  datosPagoVisa: any;
  datosTransaccionCtaCte: any;
  datosTransaccionLineaCredito: any;

  ultimoIdTransVisa: any;
  ultimoIdTransCtaCte: any;
  ultimoIdTransLineaCre: any;
  
  pagoConCtaCte = false;
  pagoConLineaCredito = false; 

  constructor(
    private productosService: ProductosService,
    private transaccionesService: TransaccionesService,
    private datosUsuarioService: DatosUsuarioService,
    private backdropService: BackdropService,
    private FormatoEmailService: FormatoEmailService,
    private urlBrowserService: UrlBrowserService
  ) { }

  ngOnInit() {
    this.productosService.getProductos().subscribe((productos: Productos[]) => {
      if (productos) {
        this.productos = productos;
  
        // Guardar el numero_producto del id 0 en numero_cta_cte
        const productoCtaCte = productos.find(producto => producto.id === 0);
        if (productoCtaCte) {
          this.numero_cta_cte = productoCtaCte.numero_producto;
        }
  
        // Guardar el numero_producto del id 2 en numero_visa
        const productoLineaCredito = productos.find(producto => producto.id === 1);
        if (productoLineaCredito) {
          this.numero_linea_credito = productoLineaCredito.numero_producto;
        }

        this.actualizarOpcionesDePago();
      }

      this.pagoVisaForm.get('montoPago')?.valueChanges.subscribe(value => {
        if (value === 'pagoTotal') {
          this.validaMontoPagoTotal();
        }
      });
    });

    this.transaccionesService.getTransVisa().subscribe((transaccionesVisa: Visa[]) => {
      if (transaccionesVisa.length > 0) {
        // Ordenar las transacciones por id_trans_visa en orden ascendente
        transaccionesVisa.sort((a, b) => a.id_trans_visa - b.id_trans_visa);
        
        // Obtener el último valor de id_trans_visa
        const ultimoIdTransVisa = transaccionesVisa[transaccionesVisa.length - 1].id_trans_visa;
        const saldoUltimaTransaccionVisa = transaccionesVisa[transaccionesVisa.length - 1].saldo;
        const cupoUsadoUltimaTransaccionVisa = transaccionesVisa[transaccionesVisa.length - 1].cupo_usado;
        
        // Guardar el valor en una variable
        this.ultimoIdTransVisa = ultimoIdTransVisa;
        this.saldoUltimaTransaccionVisa = saldoUltimaTransaccionVisa;
        this.cupoUsadoUltimaTransaccionVisa = cupoUsadoUltimaTransaccionVisa;
      }
      console.log('Cupo usado en la última transacción Visa:', this.cupoUsadoUltimaTransaccionVisa);
    });

    this.transaccionesService.getTransCuentaCorriente().subscribe((transaccionesCtaCte: CuentaCorriente[]) => {
      if (transaccionesCtaCte.length > 0) {
        // Ordenar las transacciones por id_trans_visa en orden ascendente
        transaccionesCtaCte.sort((a, b) => a.id_trans_cta_cte - b.id_trans_cta_cte);
        
        // Obtener el último valor de id_trans_visa
        const ultimoIdTransCtaCte = transaccionesCtaCte[transaccionesCtaCte.length - 1].id_trans_cta_cte;
        const saldoUltimaTransaccionCtaCte = transaccionesCtaCte[transaccionesCtaCte.length - 1].saldo;
        
        // Guardar el valor en una variable
        this.ultimoIdTransCtaCte = ultimoIdTransCtaCte;
        this.saldoUltimaTransaccionCtaCte = saldoUltimaTransaccionCtaCte;
      }
    });
  
    this.transaccionesService.getTransLineaCredito().subscribe((transaccionesLineaCre: LineaCredito[]) => {
      if (transaccionesLineaCre.length > 0) {
        // Ordenar las transacciones por id_trans_visa en orden ascendente
        transaccionesLineaCre.sort((a, b) => a.id_trans_linea_cre - b.id_trans_linea_cre);
        
        // Obtener el último valor de id_trans_visa
        const ultimoIdTransLineaCre = transaccionesLineaCre[transaccionesLineaCre.length - 1].id_trans_linea_cre;
        const saldoUltimaTransaccionLineaCredito = transaccionesLineaCre[transaccionesLineaCre.length - 1].saldo;
        const cupoUsadoUltimaTransaccionLineaCredito = transaccionesLineaCre[transaccionesLineaCre.length - 1].cupo_usado;
        console.log('Ultimo ID:', ultimoIdTransLineaCre);
        
        // Guardar el valor en una variable
        this.ultimoIdTransLineaCre = ultimoIdTransLineaCre;
        this.saldoUltimaTransaccionLineaCredito = saldoUltimaTransaccionLineaCredito;
        this.cupoUsadoUltimaTransaccionLineaCredito = cupoUsadoUltimaTransaccionLineaCredito;
      }
    });

    this.datosUsuarioService.getDatosUsuario().subscribe((datos: DatosUsuario[]) => {
      if (datos.length > 0) {
        const usuario = datos[0];
        this.email = usuario.email;
        this.pagoVisaForm.patchValue({ inputEmail: this.email });
      }
    });

    this.pagoVisaForm = new FormGroup({
      productoParaPago: new FormControl('0', [Validators.required, this.validaProductoParaPago()]),
      montoPago: new FormControl({value: 'otroMonto', disabled: true}, [Validators.required]),
      inputMontoPagoTotal: new FormControl({value: '', disabled: true}, [Validators.required, ]),
      inputOtroMonto: new FormControl({value: '', disabled: true}, [Validators.required]),
      inputEmail: new FormControl(['', [Validators.required, this.formatoEmail]]),
    });
  }

  ngAfterViewInit(): void {
    // Aplica pipe pesos
    this.pagoVisaForm.controls['inputOtroMonto'].valueChanges.subscribe((value) => {
      const transformedValue = this.pesosPipe.transform(value);
      this.pagoVisaForm.controls['inputOtroMonto'].setValue(transformedValue, { emitEvent: false });
    });
  
    // Aplica pipe pesos a inputMontoPagoTotal
    this.pagoVisaForm.controls['inputMontoPagoTotal'].valueChanges.subscribe((value) => {
      const transformedValue = this.pesosPipe.transform(value);
      this.pagoVisaForm.controls['inputMontoPagoTotal'].setValue(transformedValue, { emitEvent: false });
    });
  
    // Suscribirse a los cambios del control montoPago
    this.pagoVisaForm.controls['montoPago'].valueChanges.subscribe((value) => {
      if (value === 'pagoTotal') {
        this.pagoVisaForm.controls['inputMontoPagoTotal'].setValue(this.cupoUsadoUltimaTransaccionVisa);
      }
    });
  
    this.modales = Array.from(document.querySelectorAll('.modal')).map(el => {
      const modal = new bootstrap.Modal(el);
      el.addEventListener('show.bs.modal', () => {
        this.backdropService.show();
      });
      el.addEventListener('hide.bs.modal', () => {
        this.backdropService.hide();
      });
      return modal;
    });
  
    this.validaFormulario();
  }

  actualizarOpcionesDePago() {
    const numeroTarjetaPipe = new NumeroTarjetaPipe();
    this.opcionesDePago = [
      { value: '0', label: '-' },
      { value: '1', label: 'Cuenta Corriente N° ' + (this.numero_cta_cte || '') },
      { value: '2', label: 'Línea de Crédito N° ' + (this.numero_linea_credito || '') },
    ];
  }

  // Valida que el en select se selecciono un producto para el pago
  validaProductoParaPago(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const isInvalid = control.value === '0';
      return isInvalid ? { 'productoInvalido': { value: control.value } } : null;
    };
  }

  onMontoPagoChange(event: any): void {
    if (event.target.value === 'pagoTotal') {
      console.log(this.cupoUsadoUltimaTransaccionVisa);
    }
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

  onProductoSeleccionado(value: any): void {
    this.productoSeleccionado = value;
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

  validaMontoPagoMinimo() {
    const productoParaPagoControl = this.pagoVisaForm.get('productoParaPago');
    const productoParaPago = productoParaPagoControl ? productoParaPagoControl.value : null;
  
    if (productoParaPago === '1' || productoParaPago === '2') {
      // Convertir el valor del montoFacturado a número
      const numericMontoFacturado = Number(this.montoFacturado.replace(/\$|\.| /g, ''));
  
      // Validación 1
      if (productoParaPago === '1' && this.saldoUltimaTransaccionCtaCte !== undefined && numericMontoFacturado <= this.saldoUltimaTransaccionCtaCte) {
        this.pagoMinimoValido = true;
        console.log('valido');
      } 
      // Validación 2
      else if (productoParaPago === '2' && this.saldoUltimaTransaccionLineaCredito !== undefined && numericMontoFacturado <= this.saldoUltimaTransaccionLineaCredito) {
        this.pagoMinimoValido = true;
        console.log('valido');
      } 
      else {
        this.error3 = true;
        console.log('valor superior');
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
          return; // Detener validaciones si hay error1
        } else {
          this.error1 = false;
        }
  
        // Convertir el valor del input a número
        inputMontoValue = inputMontoValue.replace(/\$|\.| /g, '');
        const numericInputMonto = Number(inputMontoValue);
  
        // Determinar el saldo correspondiente
        const saldo = productoParaPago === '1' ? this.saldoUltimaTransaccionCtaCte : this.saldoUltimaTransaccionCtaCte;
  
        // Validación 2
        if (saldo !== undefined && numericInputMonto > saldo) {
          this.error2 = true;
          console.log('valor superior');
          return; // Detener validaciones si hay error2
        } else {
          this.error2 = false;
        }
  
        // Nueva Validación 4
        if (this.cupoUsadoUltimaTransaccionVisa !== undefined && numericInputMonto > this.cupoUsadoUltimaTransaccionVisa) {
          this.error4 = true;
          console.log('monto superior al cupo usado');
          return; // Detener validaciones si hay error4
        } else {
          this.error4 = false;
        }
  
        // Validación 3
        if (saldo !== undefined && numericInputMonto <= saldo) {
          this.montoValido = true;
          console.log('valido');
        } else {
          this.montoValido = false;
        }
      }
    }
    
  }

  validaMontoPagoTotal() {
    const inputMontoPagoTotalControl = this.pagoVisaForm.get('inputMontoPagoTotal');
    
    if (inputMontoPagoTotalControl) {
      let inputMontoPagoTotalValue = inputMontoPagoTotalControl.value;
  
      // Validación 1: Verificar si el valor está vacío o es nulo
      if (!inputMontoPagoTotalValue || inputMontoPagoTotalValue.trim() === '') {
        this.error3 = true;
        this.pagoTotalValido = false;
        console.log('valor 0');
        return; // Detener validaciones si hay error3
      } else {
        this.error3 = false;
      }
  
      // Convertir el valor del input a número
      inputMontoPagoTotalValue = inputMontoPagoTotalValue.replace(/\$|\.| /g, '');
      const numericInputMontoPagoTotal = Number(inputMontoPagoTotalValue);
  
      // Validación 2: Comparar con los saldos
      if ((this.saldoUltimaTransaccionCtaCte !== undefined && numericInputMontoPagoTotal > this.saldoUltimaTransaccionCtaCte) ||
          (this.saldoUltimaTransaccionLineaCredito !== undefined && numericInputMontoPagoTotal > this.saldoUltimaTransaccionLineaCredito)) {
        this.error3 = true;
        this.pagoTotalValido = false;
        console.log('valor superior');
        return; // Detener validaciones si hay error3
      } else {
        this.error3 = false;
      }
  
      // Validación 3: Comparar con cupoUsadoUltimaTransaccionVisa
      if (this.cupoUsadoUltimaTransaccionVisa !== undefined && numericInputMontoPagoTotal > this.cupoUsadoUltimaTransaccionVisa) {
        this.error3 = true;
        this.pagoTotalValido = false;
        console.log('valor superior al cupo usado');
        return; // Detener validaciones si hay error3
      } else {
        this.error3 = false;
        this.pagoTotalValido = true;
        console.log('valido');
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
    //this.submitted = true;
    // this.backdropService.show();
    const montoPagoControl = this.pagoVisaForm.get('montoPago');
    const inputMontoPagoTotalControl = this.pagoVisaForm.get('inputMontoPagoTotal');
    const inputMontoPagoMinimoControl = this.pagoVisaForm.get('inputMontoPagoMinimo');
    const inputOtroMontoControl = this.pagoVisaForm.get('inputOtroMonto');
    const productoParaPago = this.pagoVisaForm.get('productoParaPago');
    
    this.productoInvalido = false;
    
    if (productoParaPago && productoParaPago.value === '0') {
      this.productoInvalido = true;
      return;
    } else if (montoPagoControl && inputMontoPagoTotalControl && inputOtroMontoControl && inputMontoPagoMinimoControl && productoParaPago) {
      if ((productoParaPago.value === '1' || productoParaPago.value === '2') && montoPagoControl.value === 'pagoTotal') {
        this.validaMontoPagoTotal();
        if (!this.error3 && montoPagoControl.value) {
          let montoPagoTotal = inputMontoPagoTotalControl.value;
          montoPagoTotal = montoPagoTotal.replace(/\$|\.| /g, '');
          this.montoNumberTotal = Number(montoPagoTotal);
          console.log('montoNumberTotal:', this.montoNumberTotal);
        }
      } else if ((productoParaPago.value === '1' || productoParaPago.value === '2') && montoPagoControl.value === 'pagoMinimo') {
        this.validaMontoPagoMinimo();
        if (!this.error3 && montoPagoControl.value) {
          let montoNumberMinimo = inputMontoPagoMinimoControl.value;
          montoNumberMinimo = montoNumberMinimo.replace(/\$|\.| /g, '');
          this.montoNumberMinimo = Number(montoNumberMinimo);
          console.log('montoNumberMinimo:', this.montoNumberMinimo);
        }
      } else if ((productoParaPago.value === '1' || productoParaPago.value === '2') && montoPagoControl.value === 'otroMonto') {
        this.validaMontoOtroMonto();
        if (!this.error1 && !this.error2 && this.pagoVisaForm.value.inputOtroMonto) {
          let montoOtroMonto = this.pagoVisaForm.value.inputOtroMonto;
          montoOtroMonto = montoOtroMonto.replace(/\$|\.| /g, '');
          this.montoNumberOtro = Number(montoOtroMonto);
          console.log('montoNumberOtro:', this.montoNumberOtro);
        }
      }
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

  cancelarPago() {
    let modal = new bootstrap.Modal(document.getElementById('modalCancelarPago'), {
      backdrop: 'static',
      keyboard: false
    });
    modal.show();
  }

  confirmarCancelacion() {
    this.ngOnDestroy();
  }

  ngOnDestroy() {
    this.cancelacionConfirmada.emit();
    this.backdropService.hide();
  }

  calculoPago(): any {
    // Obtener los valores de los controles del formulario
    const montoTotalControl = this.pagoVisaForm.get('inputMontoPagoTotal');
    const montoOtroControl = this.pagoVisaForm.get('inputOtroMonto');
    console.log('inputOtroMonto:', montoOtroControl);
  
    // Asignar los valores de los controles a las variables correspondientes
    const montoTotal = montoTotalControl ? montoTotalControl.value : this.cupoUsadoUltimaTransaccionVisa;
    const montoOtro = montoOtroControl ? montoOtroControl.value : '';
  
    // Calcular el monto pagado
    const abono: any = montoTotal || montoOtro;
    const saldo: any = this.saldoUltimaTransaccionVisa;
    const cupo: any = this.cupoUsadoUltimaTransaccionVisa;
    const saldoCtaCte: any = this.saldoUltimaTransaccionCtaCte;
    const saldoLineaCredito: any = this.saldoUltimaTransaccionLineaCredito;
    const cupoLineaCredito: any = this.cupoUsadoUltimaTransaccionLineaCredito;
    let productoParaPagoValue = this.pagoVisaForm.get('productoParaPago')?.value;
  
    // Convertir abono, saldo y cupo a número
    const abonoNumero = Number(abono.replace(/\D/g, ''));
    const saldoNumero = Number(saldo);
    const cupoNumero = Number(cupo);
    const saldoCtaCteNumero = Number(saldoCtaCte);
    const saldoLineaCreditoeNumero = Number(saldoLineaCredito);
    const cupoLineaCreditoNumero = Number(cupoLineaCredito);
  
    if (productoParaPagoValue === '1') {
      this.saldo = saldoNumero + abonoNumero;
      this.saldoCtaCte = saldoCtaCteNumero - abonoNumero;
      this.cupo = cupoNumero + abonoNumero;
      this.abono = abonoNumero;
    } else if (productoParaPagoValue === '2') {
      this.saldo = saldoNumero + abonoNumero;
      this.saldoLineaCredito = saldoLineaCreditoeNumero - abonoNumero;
      this.cupoLineaCredito = cupoLineaCreditoNumero - abonoNumero;
      this.cupo = cupoNumero + abonoNumero;
      this.abono = abonoNumero;
    }
  
    console.log('Monto pagado:', abonoNumero);
  
    return {
      abono: this.abono,
      cupoUsadoUltimaTransaccionVisa: this.cupo,
      saldoUltimaTransaccionVisa: this.saldo,
    };
  }

  abrirModalPagoVisa(): void {
    var modalPago = new bootstrap.Modal(document.getElementById('modalPagoVisa'), {});
    this.mostrarBackdropCustomModal = true;
  
    this.realizarPagoVisa().subscribe(response => {
      const { datosPagoVisa, pagoConCtaCte, pagoConLineaCredito } = response;

      let datosCapturados: any;
      if (pagoConCtaCte && !pagoConLineaCredito) {
        datosCapturados = this.datosTransaccionCtaCte;
      } else if (!pagoConCtaCte && pagoConLineaCredito) {
        datosCapturados = this.datosTransaccionLineaCredito;
      }
  
      // Guardar datos en la base de datos
      this.transaccionesService.guardarPagoVisa(datosPagoVisa).subscribe(
        (_response) => {
          if (pagoConCtaCte && !pagoConLineaCredito) {
            this.transaccionesService.guardarNuevaTransaccionCtaCte(datosCapturados).subscribe(
              (_response) => {
                this.pagoCorrecto = true;
                this.errorServer = false;
                this.ocultarModalDespuesDeRetraso(modalPago);
              },
              (error) => {
                this.manejarErrorGuardarPago(error);
              }
            );
          } else if (!pagoConCtaCte && pagoConLineaCredito) {
            this.transaccionesService.guardarNuevaTransaccionLineaCredito(datosCapturados).subscribe(
              (_response) => {
                this.pagoCorrecto = true;
                this.errorServer = false;
                this.ocultarModalDespuesDeRetraso(modalPago);
              },
              (error) => {
                this.manejarErrorGuardarPago(error);
              }
            );
          }
        },
        (error) => {
          this.manejarErrorGuardarPago(error);
        }
      );
  
      modalPago.show();
    });
  }
  
  private ocultarModalDespuesDeRetraso(modalPago: any): void {
    of(null).pipe(
      delay(1500)
    ).subscribe(() => {
      this.mostrarBackdropCustomModal = false;
      modalPago.hide();
      this.urlBrowserService.navegarAComprobanteVisa();
    });
  }
  
  private manejarErrorGuardarPago(error: any): void {
    console.error('Error al guardar el pago:', error); // Manejar errores
    if (error.status === 500) {
      console.error('Error 500: Problema en el servidor');
    }
    this.pagoCorrecto = false;
    this.errorServer = true;
    this.mostrarBackdropCustomModal = false;
  }

  realizarPagoVisa(): Observable<any> {
    const datePipe = new DatePipe('en-US');
    const fecha = new Date();
    const fechaFormateada = datePipe.transform(fecha, 'yyyy-MM-dd');
    const productoCtaCte = '1';
    const productoLineaCredito = '2';
    const nombreProducto1 = 'Cuenta Corriente';
    const nombreProducto2 = 'Línea de Crédito';
  
    const result = this.calculoPago();
    console.log('Resultado del cálculo:', result);
    
    let nombreProducto = '';
    let tipoProducto = '';
  
    const productoParaPagoValue = this.pagoVisaForm.get('productoParaPago')?.value;
    if (productoParaPagoValue === productoCtaCte) {
      nombreProducto = nombreProducto1;
      tipoProducto = 'Cuenta Corriente';
      this.pagoConCtaCte = true;
      this.pagoConLineaCredito = false;
    } else if (productoParaPagoValue === productoLineaCredito) {
      nombreProducto = nombreProducto2;
      tipoProducto = 'Línea de Crédito';
      this.pagoConCtaCte = false;
      this.pagoConLineaCredito = true;
    }
  
    const nuevoIdTransVisa = this.ultimoIdTransVisa + 1;
  
    this.datosPagoVisa = {
      id_trans_visa: nuevoIdTransVisa,
      fecha: fechaFormateada,
      detalle: 'Pago realizado desde ' + nombreProducto,
      abono: result.abono, // Utiliza el valor retornado por calculoPago()
      cargo: null,
      saldo: result.saldoUltimaTransaccionVisa, // Utiliza el valor retornado por calculoPago()
      cupo_usado: result.cupoUsadoUltimaTransaccionVisa // Utiliza el valor retornado por calculoPago()
    };
  
    if (this.pagoConCtaCte) {
      this.realizarPagoConCtaCte();
    } else if (this.pagoConLineaCredito) {
      this.realizarPagoConLineaCredito();
    }
  
    return of({
      datosPagoVisa: this.datosPagoVisa,
      pagoConCtaCte: this.pagoConCtaCte,
      pagoConLineaCredito: this.pagoConLineaCredito
    });
  }

  realizarPagoConCtaCte(): Observable<any> {
    const datePipe = new DatePipe('en-US');
    const fecha = new Date();
    const fechaFormateada = datePipe.transform(fecha, 'yyyy-MM-dd');

    const result = this.calculoPago();
    console.log('Resultado del cálculo:', result);

    const nuevoIdTransCtaCte = this.ultimoIdTransCtaCte + 1;

    this.datosTransaccionCtaCte = {
      id_trans_cta_cte: nuevoIdTransCtaCte,
      fecha: fechaFormateada,
      detalle: 'Pago a Visa',
      transferencia: 0,
      id_destinatario: null,
      nombre_destinatario: null,
      rut_destinatario: null,
      mensaje: null,
      cargo: this.abono,
      abono: null,
      saldo: this.saldoCtaCte,
    };
    //console.table(this.datosTransaccionCtaCte);
    return of(this.datosTransaccionCtaCte);
  }

  realizarPagoConLineaCredito(): Observable<any> {
    const datePipe = new DatePipe('en-US');
    const fecha = new Date();
    const fechaFormateada = datePipe.transform(fecha, 'yyyy-MM-dd');

    const result = this.calculoPago();
    console.log('Resultado del cálculo:', result);

    const nuevoIdTransLineaCre = this.ultimoIdTransLineaCre + 1;

    this.datosTransaccionLineaCredito = {
      id_trans_linea_cre: nuevoIdTransLineaCre,
      fecha: fechaFormateada,
      detalle: 'Pago a Visa',
      transferencia: 0,
      id_destinatario: null,
      nombre_destinatario: null,
      rut_destinatario: null,
      mensaje: null,
      cargo: this.abono,
      abono: null,
      saldo: this.saldoLineaCredito,
      cupo_usado: this.cupoLineaCredito
    };
    console.table(this.datosTransaccionLineaCredito);
    return of(this.datosTransaccionLineaCredito);
  }

}
