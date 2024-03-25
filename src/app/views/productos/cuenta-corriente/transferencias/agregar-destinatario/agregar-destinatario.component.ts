import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';

// Services
import { AgendaDestinatariosService } from 'src/app/core/services/agenda-destinatarios.service';
import { FormatoEmailService } from '../../../../../core/services/formato-email.service';

// Pipe
import { RutPipe } from '../../../../../shared/pipes/rut.pipe';
import { CelularPipe } from '../../../../../shared/pipes/celular.pipe';
import { TelefonoFijoPipe } from '../../../../../shared/pipes/telefono-fijo.pipe';

declare var bootstrap: any;

@Component({
  selector: 'app-agregar-destinatario',
  templateUrl: './agregar-destinatario.component.html'
})
export class AgregarDestinatarioComponent implements OnInit{

  @ViewChild('crearDestinatarioCanvas') crearDestinatarioCanvas: ElementRef | undefined;

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
  // Variables para apodo
  inputApodoValido: any;
  // Variables para rut
  inputErrorVacioRut: any;
  inputValidoRut: any;
  // Variables para numero cuenta
  inputErrorVacioNumeroCuenta: any;
  inputValidoNumeroCuenta: any;
  // Variables para email
  inputErrorVacioEmail: any;
  inputValidoEmail: any;
  // Variables para celular
  inputErrorCelularInvalido: any;
  inputCelularValido: any;
  // Variables para telefono fijo
  inputErrorTelefonoFijoInvalido: any;
  inputTelefonoFijoValido: any;
  // Variable para enviar datos al services
  datosNuevoDestinatario: any;

  offcanvas: any;
  offcanvasInitialized = false;

  constructor(
    private fb: FormBuilder,
    private agendaService: AgendaDestinatariosService,
    private formatoEmailService: FormatoEmailService,
    private rutPipe: RutPipe,
    private celularPipe: CelularPipe,
    private telefonoFijoPipe: TelefonoFijoPipe
   ) {
    this.crearDestinatarioForm = this.fb.group({
      nombre: ['', Validators.required],
      apodo: ['', Validators.required],
      rut: ['', Validators.required],
      banco: ['', Validators.required],
      tipoCuenta: ['', Validators.required],
      numeroCuenta: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      celular: ['', Validators.required],
      telefono: ['', Validators.required]
    });
   }

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

    const handleClick = (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      const offcanvasElement = new bootstrap.Offcanvas(this.crearDestinatarioCanvas?.nativeElement, {backdrop: false, keyboard: true});
      offcanvasElement.show();
    };
    this.offcanvasInitialized = true;
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

  validaApodo(): void {
    const control = this.crearDestinatarioForm.get('apodoDestinatario');
  
    if (control) {
      // Si el campo está vacío, no hacer nada
      if (control.value === '') {
        this.inputApodoValido = false;
        return;
      }
  
      const isValid = control.value.length > 0;
      this.inputApodoValido = isValid;
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

  validaCelular(): void {
    const celularDestinatarioControl = this.crearDestinatarioForm.get('celularDestinatario');
    if (celularDestinatarioControl) {
      let value = celularDestinatarioControl.value as string;
  
      // Si el campo está vacío, no hacer nada
      if (value === '') {
        return;
      }
  
      // Verificar la longitud del valor
      if (value.length < 9) {
        this.inputErrorCelularInvalido = true;
        this.inputCelularValido = false;
      } else {
        this.inputErrorCelularInvalido = false;
        this.inputCelularValido = true;
        // Aplicar el pipe solo cuando el campo es válido y tiene los 9 caracteres necesarios
        value = this.celularPipe.transform(value);
        celularDestinatarioControl.setValue(value);
      }
  
      // Cambiar la cantidad de caracteres del input de 9 a 11 después de aplicar el pipe
      if (this.inputCelularValido) {
        celularDestinatarioControl.setValidators([Validators.minLength(11), Validators.maxLength(11)]);
      } else {
        celularDestinatarioControl.setValidators([Validators.minLength(9), Validators.maxLength(9)]);
      }
  
      celularDestinatarioControl.updateValueAndValidity();
      celularDestinatarioControl.markAsTouched(); // Marcar el campo como 'touched' después de la validación
    }
  }

  validaTelefono(): void {
    const telefonoDestinatarioControl = this.crearDestinatarioForm.get('telefonoDestinatario');
    if (telefonoDestinatarioControl) {
      let value = telefonoDestinatarioControl.value as string;
  
      // Si el campo está vacío, no hacer nada
      if (value === '') {
        return;
      }
  
      // Verificar la longitud del valor
      if (value.length < 9) {
        this.inputErrorTelefonoFijoInvalido = true;
        this.inputTelefonoFijoValido = false;
      } else {
        this.inputErrorTelefonoFijoInvalido = false;
        this.inputTelefonoFijoValido = true;
        // Aplicar el pipe solo cuando el campo es válido y tiene los 9 caracteres necesarios
        value = this.telefonoFijoPipe.transform(value);
        telefonoDestinatarioControl.setValue(value);
      }
  
      // Cambiar la cantidad de caracteres del input de 9 a 11 después de aplicar el pipe
      if (this.inputTelefonoFijoValido) {
        telefonoDestinatarioControl.setValidators([Validators.minLength(11), Validators.maxLength(11)]);
      } else {
        telefonoDestinatarioControl.setValidators([Validators.minLength(9), Validators.maxLength(9)]);
      }
  
      telefonoDestinatarioControl.updateValueAndValidity();
      telefonoDestinatarioControl.markAsTouched(); // Marcar el campo como 'touched' después de la validación
    }
  }
  
  // Solo permite ingresar números en los campos de texto
  soloNumeros(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  // Solo permite numeros y letra K en el ultimo digito
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

  validaFormulario(): Observable<any> {
    this.submitted = true;
  
    // ValidA custom-select banco
    const bancoDestinatarioControl = this.crearDestinatarioForm.get('bancoDestinatario');
    this.bancoInvalido = false;
    if (bancoDestinatarioControl && bancoDestinatarioControl.value === '0') {
      this.bancoInvalido = true;
      return of(null);
    }
  
    // ValidA custom-select tipo de cuenta
    const cuentaDestinatarioControl = this.crearDestinatarioForm.get('cuentaDestinatario');
    this.cuentaInvalida = false;
    if (cuentaDestinatarioControl && cuentaDestinatarioControl.value === '0') {
      this.cuentaInvalida = true;
      return of(null);
    }
  
    // Verifica que el formulario sea válido
    if (this.crearDestinatarioForm.valid) {
      this.agendaService.getDestinatarios().subscribe(destinatarios => {
        const maxId = Math.max(...destinatarios.map((d: { id: any; }) => Number(d.id)));
        const newId = maxId + 1;
        const formValues = this.crearDestinatarioForm.value;
        this.datosNuevoDestinatario = JSON.stringify({
          id: newId.toString(),
          nombre: formValues.nombreDestinatario,
          apodo: formValues.apodoDestinatario,
          rut: formValues.rutDestinatario,
          banco: this.listaBancos.find(b => b.value === formValues.bancoDestinatario)?.label ?? '',
          tipoCuenta: this.tiposCuenta.find(t => t.value === formValues.cuentaDestinatario)?.label ?? '',
          numeroCuenta: formValues.numeroCuentaDestinatario,
          email: formValues.emailDestinatario,
          celular: formValues.celularDestinatario.replace(/\s/g, ''),
          telefono: formValues.telefonoDestinatario.replace(/\s/g, '')
        });
  
        // Envía los datos al servicio
        this.agendaService.emitirDatosNuevoDestinatario(this.datosNuevoDestinatario);
      });
    }
    return of(null);
  }

  /*toggleOffcanvas(): void {
    if (this.crearDestinatarioCanvas?.nativeElement.classList.contains('show')) {
      this.crearDestinatarioCanvas.nativeElement.classList.remove('show');
      console.log('Offcanvas cerrado');
    }
  }*/

}
