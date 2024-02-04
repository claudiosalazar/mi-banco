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
  saldoCtaCte: number | undefined;
  saldoLineaCre: number | undefined;
  saldoVisa: number | undefined;
  datosUsuarioActual: DatosUsuarioActual | undefined;
  submitted = false;
  contenedorPagoTotal = false;
  contenedorOtroPago = true;
  
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

  ngOnInit(): void {
    this.getDatosUsuario();
    this.pagoVisaForm = new FormGroup({
      productoParaPago: new FormControl('0', [Validators.required, this.validateProductoParaPago()]),
      montoPago: new FormControl({value: 'otroMonto', disabled: true}, [Validators.required]),  
      inputMontoPagoTotal: new FormControl({value: '', disabled: true}, [Validators.required]),
      inputOtroMonto: new FormControl({value: '', disabled: true}, [Validators.required]),
      inputEmail: new FormControl('', [Validators.required]),
      radio: new FormControl(''),
    });
    

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

  soloNumeros(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onRadioChange(event: any) {
    const montoPagoControl = this.pagoVisaForm.get('montoPago');
    if (montoPagoControl && montoPagoControl.value === 'pagoTotal') {
      const transformedValue = this.pesosPipe.transform(this.cupoUtilizadoVisa);
      this.pagoVisaForm.controls['inputMontoPagoTotal'].setValue(transformedValue);
      this.pagoVisaForm.controls['inputOtroMonto'].reset();
    } else {
      this.pagoVisaForm.controls['inputMontoPagoTotal'].reset();
      this.pagoVisaForm.controls['inputOtroMonto'].reset();
    }
  }

  getDatosUsuario(): void {
    this.datosUsuarioService.getDatosUsuario().subscribe(data => {
      this.datosUsuarioActual = data;
      this.saldoCtaCte = this.saldosService.calcularSaldoCtaCte(this.datosUsuarioActual);
      this.saldoLineaCre = this.saldosService.calcularSaldoLineaCre(this.datosUsuarioActual);
      this.saldoVisa = this.saldosService.calcularSaldoVisa(this.datosUsuarioActual);
      this.cupoUtilizadoVisa = this.saldosService.calcularDiferenciaVisa(this.datosUsuarioActual);
    });
  }

  validateProductoParaPago(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const isInvalid = control.value === '0';
      return isInvalid ? { 'productoInvalido': { value: control.value } } : null;
    };
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

  onSubmit(): void {
    this.submitted = true;
    console.log(this.pagoVisaForm?.value);
  }

}

