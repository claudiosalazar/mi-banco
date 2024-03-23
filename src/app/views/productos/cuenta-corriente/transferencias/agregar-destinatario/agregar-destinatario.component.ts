import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { FormatoEmailService } from '../../../../../core/services/formato-email.service';
import { RutPipe } from '../../../../../shared/pipes/rut.pipe';

@Component({
  selector: 'app-agregar-destinatario',
  templateUrl: './agregar-destinatario.component.html'
})
export class AgregarDestinatarioComponent implements OnInit{
  // Array bancos
  listaBancos = [
    { value: '0', label: '-' },
    { value: '1', label: 'Banco de Chile' },
    { value: '2', label: 'Banco Internacional' },
    { value: '3', label: 'Scotiabank Chile' },
    { value: '4', label: 'BCI' },
    { value: '5', label: 'Corpbanca' },
    { value: '6', label: 'Banco BICE' },
    { value: '7', label: 'HSBC Bank' },
    { value: '8', label: 'Banco Santander' },
    { value: '9', label: 'Banco ITAÚ' },
    { value: '10', label: 'Banco Security' },
    { value: '11', label: 'Banco Falabella' },
    { value: '12', label: 'Deutsche Bank' },
    { value: '13', label: 'Banco Ripley' },
    { value: '14', label: 'Rabobank Chile' },
    { value: '15', label: 'Banco Consorcio' },
    { value: '16', label: 'Banco Penta' },
    { value: '17', label: 'Banco Paris' },
    { value: '18', label: 'BBVA' },
    { value: '19', label: 'Banco BTG Pactual Chile' },
    { value: '20', label: 'Banco do Brasil S.A.' },
    { value: '21', label: 'JP Morgan Cahse Bank, N. A.' },
    { value: '22', label: 'Banco de La Nación Argentina' },
    { value: '23', label: 'The Bank of Tokyo-Mitsubishi UFJ, LTD' },
    { value: '24', label: 'BCI - Miami' },
    { value: '25', label: 'Banco del Estado de Chile - Nueva York' },
    { value: '26', label: 'Corpbanca - Nueva York' },
    { value: '27', label: 'Banco del Estado de Chile' }
  ];

  // Array de tipos de cuenta
  tiposCuenta = [
    { value: '0', label: '-' },
    { value: '1', label: 'Cuenta Corriente' },
    { value: '2', label: 'Cuenta Vista' },
    { value: '3', label: 'Cuenta de Ahorro', },
    { value: '4', label: 'Cuenta Bancaria para estudiante' },
    { value: '5', label: 'Cuenta Chequera Electrónica' },
    { value: '6', label: 'Cuenta Bancaria para extranjeros' },
  ];

  crearDestinatarioForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  campoVacio: boolean = false;
  datoValido: boolean = false;
  nombreDestinatario: any;
  rutDestinatario: any;
  numeroCuentaDestinatario: any;
  emailDestinatario: any;
  bancoInvalido: any;
  cuentaInvalida: any;
  // Variable para nombre
  inputErrorVacioNombre: any;
  inputErrorApellido: any;
  inputValidoNombre: any;
  // Variables para rut
  inputErrorVacioRut: any;
  inputValidoRut: any;
  // Variables para numero cuenta
  inputErrorVacioNumeroCuenta: any;
  inputValidoNumeroCuenta: any;
  // Variables para email
  inputErrorVacioEmail: any;
  inputValidoEmail: any;
  
  selectClass: any;

  constructor(
    private formatoEmailService: FormatoEmailService,
    private rutPipe: RutPipe
   ) {}

  ngOnInit(): void {
    this.crearDestinatarioForm = new FormGroup({
      nombreDestinatario: new FormControl('', [Validators.required]),
      apodoDestinatario: new FormControl(''),
      rutDestinatario: new FormControl('', [Validators.required]),
      bancoDestinatario: new FormControl('0', [Validators.required, this.validaBanco()]),
      cuentaDestinatario: new FormControl('0', [Validators.required, this.validaTipoCuenta()]),
      numeroCuentaDestinatario: new FormControl('', [Validators.required]),
      emailDestinatario: new FormControl('', [Validators.required]),
      celularDestinatario: new FormControl(''),
      telefonoDestinatario: new FormControl(''),
    });
    
  }

  validaNombre(): void {
    const nombreDestinatarioControl = this.crearDestinatarioForm.get('nombreDestinatario');
    if (nombreDestinatarioControl) {
      const nombreDestinatario = nombreDestinatarioControl.value as string;
      const palabras = nombreDestinatario.trim().split(' ');
  
      if (nombreDestinatario.trim() === '') {
        nombreDestinatarioControl.setErrors({ 'inputErrorVacioNombre': true });
      } else if (palabras.length === 1) {
        nombreDestinatarioControl.setErrors({ 'inputErrorApellido': true });
      } else {
        nombreDestinatarioControl.setErrors(null);
      }
  
      this.inputErrorVacioNombre = nombreDestinatarioControl.errors?.['inputErrorVacioNombre'];
      this.inputErrorApellido = nombreDestinatarioControl.errors?.['inputErrorApellido'];
      this.inputValidoNombre = nombreDestinatarioControl.valid;
    }
  }

  validaRut(): void {
    const rutDestinatarioControl = this.crearDestinatarioForm.get('rutDestinatario');
    if (rutDestinatarioControl) {
      const rutDestinatario = rutDestinatarioControl.value as any;
  
      if (rutDestinatario.trim() === '') {
        rutDestinatarioControl.setErrors({ 'inputErrorVacioRut': true });
      } else if (rutDestinatario.length < 8 || rutDestinatario.length > 9) {
        rutDestinatarioControl.setErrors({ 'inputErrorFormatoRut': true });
      } else {
        rutDestinatarioControl.setErrors(null);
        rutDestinatarioControl.setValue(this.rutPipe.transform(rutDestinatario));
      }
  
      this.inputErrorVacioRut = rutDestinatarioControl.errors?.['inputErrorVacioRut'];
      this.inputValidoRut = rutDestinatarioControl.valid;
    }
  }

  formatoRut(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    const value = (event.target as HTMLInputElement).value;
  
    // Permitir solo números
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      // Si el carácter no es un número, permitir solo 'K' como último carácter
      if (charCode === 75 || charCode === 107) { // 75 y 107 son los códigos de tecla para 'K' y 'k' respectivamente
        return value.length === 8; // Permitir 'K' solo si ya hay 8 caracteres
      }
      return false;
    }
    return true;
  }

  validaBanco(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const isInvalid = control.value === '0';
      return isInvalid ? { 'bancoInvalido': { value: control.value } } : null;
    };
  }

  validaTipoCuenta(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const isInvalid = control.value === '0';
      return isInvalid ? { 'cuentaInvalida': { value: control.value } } : null;
    };
  }


  validaNumeroCuenta(): void {
    const numeroCuentaDestinatarioControl = this.crearDestinatarioForm.get('numeroCuentaDestinatario');
    if (numeroCuentaDestinatarioControl) {
      const numeroCuentaDestinatario = numeroCuentaDestinatarioControl.value as string;
  
      if (numeroCuentaDestinatario.trim() === '') {
        numeroCuentaDestinatarioControl.setErrors({ 'inputErrorVacioNumeroCuenta': true });
      } else {
        numeroCuentaDestinatarioControl.setErrors(null);
      }
  
      this.inputErrorVacioNumeroCuenta = numeroCuentaDestinatarioControl.errors?.['inputErrorVacioNumeroCuenta'];
      this.inputValidoNumeroCuenta = numeroCuentaDestinatarioControl.valid;
    }
  }

  validaEmail(emailDestinatario: string) {
    const emailControl = this.crearDestinatarioForm.controls[emailDestinatario];
    emailControl.markAsTouched();
    emailControl.setValidators([Validators.required, Validators.email, this.formatoEmailService.formatoEmail]);
    emailControl.updateValueAndValidity();
  
    if (emailControl.value.trim() === '') {
      emailControl.setErrors({ 'required': true });
    } else if (emailControl.errors?.['email'] || emailControl.errors?.['customEmail']) {
      emailControl.setErrors({ 'customEmail': true });
    } else {
      emailControl.setErrors(null);
    }
  
    this.inputValidoEmail = emailControl.valid;
  }

  // Permite ingresar solo caracteres numéricos en el input
  soloNumeros(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  

  guardarDestinatario() {
    this.submitted = true;
    const bancoDestinatarioControl = this.crearDestinatarioForm.get('bancoDestinatario');
    this.bancoInvalido = false;
    if (bancoDestinatarioControl && bancoDestinatarioControl.value === '0') {
      // Si el producto seleccionado es '0', establece el error de producto inválido en true
      this.bancoInvalido = true;
      return;
    }

    const cuentaDestinatarioControl = this.crearDestinatarioForm.get('cuentaDestinatario');
    this.cuentaInvalida = false;
    if (cuentaDestinatarioControl && cuentaDestinatarioControl.value === '0') {
      // Si el producto seleccionado es '0', establece el error de producto inválido en true
      this.cuentaInvalida = true;
      return;
    }

    if (this.crearDestinatarioForm.valid) {
      console.log('Formulario válido, se puede enviar');
      // Aquí puedes poner el código para enviar el formulario
    } else {
      console.log('Formulario inválido, por favor corrige los errores');
    }
  }

}
