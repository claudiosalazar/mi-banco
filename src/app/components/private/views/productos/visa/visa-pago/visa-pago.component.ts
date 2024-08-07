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
import { NumeroTarjetaPipe } from '../../../../../../shared/pipes/numero-tarjeta.pipe';
import { PesosPipe } from './../../../../../../shared/pipes/pesos.pipe';

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
  transaccionesLineaCre: string[] = [];
  transaccionesCtaCte: string[] = [];
  transaccionesVisa: string[] = [];
  pagoVisaForm: FormGroup = new FormGroup({});
  saldoUltimaTransaccionVisa: number | null = null;
  saldoUltimaTransaccionCtaCte: number | undefined;
  saldoUltimaTransaccionLineaCredito: number | undefined;
  cupoUsadoUltimaTransaccionVisa: number | undefined;
  cupoUltimaTransaccionVisa: number | null = null;
  montoPagado: any;
  productoInvalido: any;
  montoNumberTotal: number | undefined;
  montoNumberOtro: number | undefined;
  email: any;
  numero_cta_cte: string | null = null;
  numero_linea_credito: string | null = null;

  private pesosPipe = new PesosPipe();
  
  // Variables para el select
  opcionesDePago: { value: string, label: string }[] = [
    { value: '0', label: '-' }
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
  montoValido: boolean = false;

  // Variables para modal
  pagoCorrecto: boolean = true;
  errorServer: boolean = false;

  mostrarBackdropCustomModal = false;
  modales: any[] = [];

  constructor(
    private productosService: ProductosService,
    private transaccionesService: TransaccionesService,
    private datosUsuarioService: DatosUsuarioService,
    private backdropService: BackdropService,
    private FormatoEmailService: FormatoEmailService
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
    });

    this.transaccionesService.getTransVisa().subscribe((transaccionesVisa: Visa[]) => {
      if (transaccionesVisa && transaccionesVisa.length > 0) {
        // Ordenar las transacciones por ID en orden descendente
        transaccionesVisa.sort((a, b) => b.id_trans_visa - a.id_trans_visa);
    
        // Obtener la última transacción (primer elemento después de ordenar)
        const ultimaTransaccion = transaccionesVisa[0];
    
        this.saldoUltimaTransaccionVisa = ultimaTransaccion.saldo;
        this.cupoUsadoUltimaTransaccionVisa = ultimaTransaccion.cupo_usado;
    
        // Actualizar el valor del campo inputMontoPagoTotal
        this.pagoVisaForm.patchValue({
          inputMontoPagoTotal: this.cupoUsadoUltimaTransaccionVisa
        });
      } else {
        this.saldoUltimaTransaccionVisa = null;
        this.cupoUltimaTransaccionVisa = null;
      }
    });

    this.transaccionesService.getTransCuentaCorriente().subscribe((transaccionesCtaCte: CuentaCorriente[]) => {
      if (transaccionesCtaCte) {
        this.saldoUltimaTransaccionCtaCte = transaccionesCtaCte.length > 0 ? transaccionesCtaCte[transaccionesCtaCte.length - 1].saldo : null;
      }
    });

    this.transaccionesService.getTransLineaCredito().subscribe((transaccionesLineaCre: LineaCredito[]) => {
      if (transaccionesLineaCre) {
        this.saldoUltimaTransaccionLineaCredito = transaccionesLineaCre.length > 0 ? transaccionesLineaCre[transaccionesLineaCre.length - 1].saldo : null;
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

  onMontoPagoChange(event: any): void {
    if (event.target.value === 'pagoTotal') {
      console.log(this.cupoUsadoUltimaTransaccionVisa);
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
    this.submitted = true;
    this.backdropService.show();
    const montoPagoControl = this.pagoVisaForm.get('montoPago');
    const inputMontoPagoTotalControl = this.pagoVisaForm.get('inputMontoPagoTotal');
    const inputOtroMontoControl = this.pagoVisaForm.get('inputOtroMonto');
    const productoParaPago = this.pagoVisaForm.get('productoParaPago');
  
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
        if (!this.error1 && !this.error2 && this.pagoVisaForm.value.inputOtroMonto) {
          let montoOtroMonto = this.pagoVisaForm.value.inputOtroMonto;
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

      /*this.datosPagoLineaCredito().subscribe({
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
      });*/
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

}
