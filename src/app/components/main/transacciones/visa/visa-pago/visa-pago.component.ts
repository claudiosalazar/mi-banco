import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { DatosUsuarioService } from '../../../../../services/datos-usuario.service';
import { SaldosService } from '../../../../../services/saldos.service';
import { DatosUsuarioActual } from '../../../../../../assets/models/datos-usuario.model';

@Component({
  selector: 'app-visa-pago',
  templateUrl: './visa-pago.component.html'
})
export class VisaPagoComponent implements OnInit {

  pagoVisaForm: FormGroup = new FormGroup({});
  saldoCtaCte: number | undefined;
  saldoLineaCre: number | undefined;
  saldoVisa: number | undefined;
  datosUsuarioActual: DatosUsuarioActual | undefined;
  submitted = false;
  mostrarInputMontoPagoTotal = false;

  // Variables para datos de usuario
  visaN: any;
  visaSaldo: any | undefined;
  cupoUtilizadoVisa: any;
  productoSeleccionado: any;
  elementosHabilitados = false;


  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private montosUsuarioService: DatosUsuarioService,
    private saldosService: SaldosService
  ) {}

  ngOnInit(): void {
    this.getDatosUsuario();
    this.pagoVisaForm = new FormGroup({
      productoParaPago: new FormControl('0', [Validators.required, this.validateProductoParaPago()]),
      checkMontoPagoTotal: new FormControl({value: '', disabled: true}, [Validators.required]),  
      checkMontoOtroMonto: new FormControl({value: '', disabled: true}, [Validators.required]),  
      inputMontoPagoTotal: new FormControl({value: '', disabled: true}, [Validators.required]),
      inputOtroMonto: new FormControl({value: '', disabled: true}, [Validators.required]),
      inputEmail: new FormControl('', [Validators.required]),
    })
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

  /* onProductoSeleccionado(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.productoSeleccionado = target.value;
    }
  } */

  onProductoSeleccionado(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.productoSeleccionado = target.value;
    }
    this.elementosHabilitados = this.productoSeleccionado === '1' || this.productoSeleccionado === '2';
  
    // Habilitar o deshabilitar los FormControl dependiendo del valor seleccionado
    if (this.elementosHabilitados) {
      this.pagoVisaForm.controls['checkMontoPagoTotal'].enable();
      this.pagoVisaForm.controls['checkMontoOtroMonto'].enable();
      this.pagoVisaForm.controls['inputOtroMonto'].enable();
    } else {
      this.pagoVisaForm.controls['checkMontoPagoTotal'].disable();
      this.pagoVisaForm.controls['checkMontoOtroMonto'].disable();
      this.pagoVisaForm.controls['inputOtroMonto'].disable();
    }
  }

  onSubmit(): void {
    this.submitted = true;
    console.log(this.pagoVisaForm?.value);
  }

}
