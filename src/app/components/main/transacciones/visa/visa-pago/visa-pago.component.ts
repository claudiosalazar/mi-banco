import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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

  // Variables para datos de usuario
  visaN: any;
  visaSaldo: any | undefined;
  cupoUtilizadoVisa: any;


  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private montosUsuarioService: DatosUsuarioService,
    private saldosService: SaldosService
  ) {}

  ngOnInit(): void {
    this.getDatosUsuario();
    this.pagoVisaForm = new FormGroup({
      productoParaPago: new FormControl('', [Validators.required]),
      montoPago: new FormControl('', [Validators.required]),  
      inputMontoPagoTotal: new FormControl('', [Validators.required]),
      inputOtroMonto: new FormControl('', [Validators.required]),
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

  getMontosUsuario(): void {
    this.montosUsuarioService.getDatosUsuario().subscribe(data => {
      this.datosUsuarioActual = data;
    });
  }

  onSubmit(): void {
    console.log(this.pagoVisaForm?.value);
  }

}

