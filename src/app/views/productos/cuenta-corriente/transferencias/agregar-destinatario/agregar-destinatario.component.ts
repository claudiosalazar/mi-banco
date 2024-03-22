import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ValidaEmailService } from 'src/app/core/services/validador-email.service';


@Component({
  selector: 'app-agregar-destinatario',
  templateUrl: './agregar-destinatario.component.html'
})
export class AgregarDestinatarioComponent implements OnInit{

  crearDestinatarioForm: FormGroup = new FormGroup({});
  campoVacio: boolean = false;
  datoValido: boolean = false;
  nombreDestinatario: any;
  rutDestinatario: any;
  numeroCuentaDestinatario: any;
  emailDestinatario: any;
  submitted: boolean = false;
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
  // inputErrorVacioEmail: any;
  // inputValidoEmail: any;

  // Array lista de
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
  
  selectClass: any;

  constructor(
    private validaEmailService: ValidaEmailService
   ) {}

  ngOnInit(): void {
    this.crearDestinatarioForm = new FormGroup({
      nombreDestinatario: new FormControl('', [Validators.required, this.validaNombre()]),
      apodoDestinatario: new FormControl(''),
      rutDestinatario: new FormControl('', [Validators.required, this.validaRut()]),
      bancoDestinatario: new FormControl('0', [Validators.required, this.validaBanco()]),
      cuentaDestinatario: new FormControl('0', [Validators.required, this.validaCuenta()]),
      numeroCuentaDestinatario: new FormControl('', [Validators.required, this.validaNumeroCuenta()]),
      emailDestinatario: new FormControl('', [Validators.required, this.validaEmailService.formatoEmail]),
      celularDestinatario: new FormControl(''),
      telefonoDestinatario: new FormControl(''),
    });
    
  }

  validaNombre(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const nombreDestinatario = control.value as string;
  
      // Si el input está vacío, establece inputErrorVacio en true
      if (nombreDestinatario.trim() === '') {
        return { 'inputErrorVacio': { value: control.value } };
      }
      // Si el input tiene solo una palabra, establece inputErrorApellido en true
      else if (!nombreDestinatario.includes(' ')) {
        return { 'inputErrorApellido': { value: control.value } };
      }
      // Si el input tiene 2 palabras, establece inputValido en true
      else {
        return null;
      }
    };
  }

  validaRut(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const rutDestinatario = control.value as string;
  
      // Si el input está vacío, establece inputErrorVacio en true
      if (rutDestinatario.trim() === '') {
        return { 'inputErrorVacioRut': { value: control.value } };
      }
      // Si el input tiene datos ingresados, es válido
      else {
        return null;
      }
    };
  }

  validaBanco(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const isInvalid = control.value === '0';
      return isInvalid ? { 'bancoInvalido': { value: control.value } } : null;
    };
  }

  validaCuenta(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const isInvalid = control.value === '0';
      return isInvalid ? { 'cuentaInvalida': { value: control.value } } : null;
    };
  }

  validaNumeroCuenta(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const numeroCuentaDestinatario = control.value as string;
  
      // Si el input está vacío, establece inputErrorVacio en true
      if (numeroCuentaDestinatario.trim() === '') {
        return { 'inputErrorVacioNumeroCuenta': { value: control.value } };
      }
      // Si el input tiene datos ingresados, es válido
      else {
        return null;
      }
    };
  }

  // Valida que el email este escrito correctamente
  /* validaEmail(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const emailDestinatario = control.value as string;
  
      // Si el input está vacío, establece inputErrorVacio en true
      if (emailDestinatario.trim() === '') {
        return { 'inputErrorVacioNumeroCuenta': { value: control.value } };
      }
      // Si el input tiene datos ingresados, es válido
      else {
        return null;
      }
    };
  } */
  emailValido(inputEmail: string) {
    this.crearDestinatarioForm.controls[inputEmail].markAsPristine();
    this.crearDestinatarioForm.controls[inputEmail].markAsUntouched();
    this.crearDestinatarioForm.controls[inputEmail].setValidators([Validators.required, this.validaEmailService.formatoEmail]);
    this.crearDestinatarioForm.controls[inputEmail].updateValueAndValidity();
  }

  // Permite ingresar solo caracteres numéricos en el input
  soloNumeros(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  validaFormulario() {
    this.submitted = true;

    const nombreDestinatarioControl = this.crearDestinatarioForm.get('nombreDestinatario');
    const rutDestinatarioControl = this.crearDestinatarioForm.get('rutDestinatario');
    const bancoDestinatarioControl = this.crearDestinatarioForm.get('bancoDestinatario');
    const numeroCuentaDestinatarioControl = this.crearDestinatarioForm.get('numeroCuentaDestinatario');

    this.bancoInvalido = false;

    
    if (nombreDestinatarioControl) {
      this.inputErrorVacioNombre = nombreDestinatarioControl.errors?.['inputErrorVacio'];
      this.inputErrorApellido = nombreDestinatarioControl.errors?.['inputErrorApellido'];
      this.inputValidoNombre = nombreDestinatarioControl.valid;
    }

    if (rutDestinatarioControl) {
      this.inputErrorVacioRut = rutDestinatarioControl.errors?.['inputErrorVacio'];
      this.inputValidoRut = rutDestinatarioControl.valid;
    }

    if (bancoDestinatarioControl && bancoDestinatarioControl.value === '0') {
      // Si el producto seleccionado es '0', establece el error de producto inválido en true
      this.bancoInvalido = true;
      return;
    }

    if (numeroCuentaDestinatarioControl) {
      this.inputErrorVacioNumeroCuenta = numeroCuentaDestinatarioControl.errors?.['inputErrorVacioNumeroCuenta'];
      this.inputValidoNumeroCuenta = numeroCuentaDestinatarioControl.valid;
    }

  }

  resetFormulario() {
    this.crearDestinatarioForm.reset({
      nombreDestinatario: '',
      apodoDestinatario: '',
      rutDestinatario: '',
      bancoDestinatario: '0',
      cuentaDestinatario: '0',
      numeroCuentaDestinatario: '',
      emailDestinatario: '',
      celularDestinatario: '',
      telefonoDestinatario: '',
    });
    this.crearDestinatarioForm.markAsPristine();
    this.crearDestinatarioForm.markAsUntouched();
    this.submitted = false;
  
    // Restablece las variables de validación
    this.inputErrorVacioNombre = false;
    this.inputErrorApellido = false;
    this.inputValidoNombre = false;
    this.inputErrorVacioRut = false;
    this.inputValidoRut = false;
    this.bancoInvalido = false;
    this.cuentaInvalida = false;
    this.inputErrorVacioNumeroCuenta = false;
    this.inputValidoNumeroCuenta = false;
  }

  guardarDestinatario() {
    this.validaFormulario();

    if (this.crearDestinatarioForm.valid) {
      console.log('Formulario válido, se puede enviar');
      // Aquí puedes poner el código para enviar el formulario
    } else {
      console.log('Formulario inválido, por favor corrige los errores');
    }
  }

}
