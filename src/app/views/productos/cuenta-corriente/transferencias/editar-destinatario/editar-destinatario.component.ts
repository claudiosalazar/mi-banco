import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

// Services
import { AgendaDestinatariosService } from 'src/app/core/services/agenda-destinatarios.service';
import { FormatoEmailService } from '../../../../../core/services/formato-email.service';

// Pipe
import { RutPipe } from '../../../../../shared/pipes/rut.pipe';
import { CelularPipe } from '../../../../../shared/pipes/celular.pipe';
import { TelefonoFijoPipe } from '../../../../../shared/pipes/telefono-fijo.pipe';
import { skip } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';

declare var bootstrap: any;

@Component({
  selector: 'app-editar-destinatario',
  templateUrl: './editar-destinatario.component.html'
})
export class EditarDestinatarioComponent implements OnInit{

  @ViewChild('editarDestinatarioCanvas') editarDestinatarioCanvas: ElementRef | undefined;
  @ViewChild('bancoDestinatario', { static: false }) bancoDestinatario: ElementRef | undefined;
  @ViewChild('cuentaDestinatario', { static: false }) cuentaDestinatario: ElementRef | undefined;

  idDestinatarioAeditar = new BehaviorSubject<any>(null);

  // Array bancos
  listaBancos = [
    { value: '0', label: '-' },
    { value: '1', label: 'Mi Banco' },
    { value: '2', label: 'Banco de Chile' },
    { value: '3', label: 'Banco Internacional' },
    { value: '4', label: 'Scotiabank Chile' },
    { value: '5', label: 'BCI' },
    { value: '6', label: 'Corpbanca' },
    { value: '7', label: 'Banco BICE' },
    { value: '8', label: 'HSBC Bank' },
    { value: '9', label: 'Banco Santander' },
    { value: '10', label: 'Banco ITAÚ' },
    { value: '11', label: 'Banco Security' },
    { value: '12', label: 'Banco Falabella' },
    { value: '13', label: 'Deutsche Bank' },
    { value: '14', label: 'Banco Ripley' },
    { value: '15', label: 'Rabobank Chile' },
    { value: '16', label: 'Banco Consorcio' },
    { value: '17', label: 'Banco Penta' },
    { value: '18', label: 'Banco Paris' },
    { value: '19', label: 'BBVA' },
    { value: '20', label: 'Banco BTG Pactual Chile' },
    { value: '21', label: 'Banco do Brasil S.A.' },
    { value: '22', label: 'JP Morgan Cahse Bank, N. A.' },
    { value: '23', label: 'Banco de La Nación Argentina' },
    { value: '24', label: 'The Bank of Tokyo-Mitsubishi UFJ, LTD' },
    { value: '25', label: 'BCI - Miami' },
    { value: '26', label: 'Banco del Estado de Chile - Nueva York' },
    { value: '27', label: 'Corpbanca - Nueva York' },
    { value: '28', label: 'Banco del Estado de Chile' }
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

  editarDestinatarioForm: FormGroup = new FormGroup({});
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

  offcanvas: any;
  offcanvasInitialized = false;

  bancoSeleccionado: any | undefined;
  tipoCuentaSeleccionada: any | undefined;

  formChanged = false;

  datosDestinatarioEditado: any;

  constructor(
    private agendaService: AgendaDestinatariosService,
    private formatoEmailService: FormatoEmailService,
    private rutPipe: RutPipe,
    private celularPipe: CelularPipe,
    private telefonoFijoPipe: TelefonoFijoPipe
   ) {}

   ngOnInit(): void {
    this.editarDestinatarioForm = new FormGroup({
      nombreDestinatario: new FormControl('', [Validators.required]),
      apodoDestinatario: new FormControl(''),
      rutDestinatario: new FormControl('', [Validators.required]),
      bancoDestinatario: new FormControl('', [Validators.required, this.validaBanco()]),
      cuentaDestinatario: new FormControl('', [Validators.required, this.validaTipoCuenta()]),
      numeroCuentaDestinatario: new FormControl('', [Validators.required]),
      emailDestinatario: new FormControl('', [Validators.required]),
      celularDestinatario: new FormControl('', [this.validaLongitudTelefonos()]),
      telefonoDestinatario: new FormControl('', [this.validaLongitudTelefonos()]),
    });

    this.agendaService.idDestinatarioAeditar.subscribe(id => {
      this.idDestinatarioAeditar.next(id);
      console.log('ID del destinatario a editar:', id);
  
      if (id) {
        this.agendaService.getDestinatarioPorId(id).subscribe(destinatario => {
          this.cargarDatosDestinatario(destinatario);
          console.log('Datos del destinatario cargados en el formulario:', destinatario);
        });
      }
    });

    // Suscribirse a los cambios de valor en los campos 'bancoDestinatario' y 'cuentaDestinatario'
    this.editarDestinatarioForm.get('bancoDestinatario')?.valueChanges.subscribe((valor: string) => {
      this.bancoSeleccionado = this.listaBancos.find(banco => banco.value === valor)?.label;
    });

    this.editarDestinatarioForm.get('cuentaDestinatario')?.valueChanges.subscribe((valor: string) => {
      this.tipoCuentaSeleccionada = this.tiposCuenta.find(tipoCuenta => tipoCuenta.value === valor)?.label;
    });
  
    const handleClick = (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      const offcanvasElement = new bootstrap.Offcanvas(this.editarDestinatarioCanvas?.nativeElement, {backdrop: false, keyboard: true});
      offcanvasElement.show();
    };
    
    this.offcanvasInitialized = true;

    this.editarDestinatarioForm.valueChanges.pipe(skip(1)).subscribe(() => {
      this.formChanged = true;
    });

  }  

  ngAfterViewInit(): void {
    this.agendaService.getDestinatarioPorId(this.idDestinatarioAeditar).subscribe(destinatario => {
      this.cargarDatosDestinatario(destinatario);
      console.log('Datos del destinatario:', destinatario);
    });

    this.editarDestinatarioForm.get('celularDestinatario')?.valueChanges.subscribe((valor: string) => {
      const valorTransformado = this.celularPipe.transform(valor);
      this.editarDestinatarioForm.get('celularDestinatario')?.setValue(valorTransformado, { emitEvent: false });
    });

    this.editarDestinatarioForm.get('telefonoDestinatario')?.valueChanges.subscribe((valor: string) => {
      const valorTransformado = this.telefonoFijoPipe.transform(valor);
      this.editarDestinatarioForm.get('telefonoDestinatario')?.setValue(valorTransformado, { emitEvent: false });
    });
  }

  cargarDatosDestinatario(destinatario: any): void {
    if (destinatario) {
      this.editarDestinatarioForm.patchValue({
        nombreDestinatario: destinatario.nombre,
        apodoDestinatario: destinatario.apodo,
        rutDestinatario: destinatario.rut,
        bancoDestinatario: destinatario.banco,
        cuentaDestinatario: destinatario.tipoCuenta,
        numeroCuentaDestinatario: destinatario.numeroCuenta,
        emailDestinatario: destinatario.email,
        celularDestinatario: destinatario.celular,
        telefonoDestinatario: destinatario.telefono,
      });
  
      // Actualiza bancoSeleccionado directamente con el valor del banco del destinatario
      this.bancoSeleccionado = destinatario.banco;
      this.tipoCuentaSeleccionada = destinatario.tipoCuenta;
    }
  }

  validaNombre(): void {
    const nombreDestinatarioControl = this.editarDestinatarioForm.get('nombreDestinatario');
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
    const control = this.editarDestinatarioForm.get('apodoDestinatario');
  
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
    const rutDestinatarioControl = this.editarDestinatarioForm.get('rutDestinatario');
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
    const numeroCuentaDestinatarioControl = this.editarDestinatarioForm.get('numeroCuentaDestinatario');
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
    const emailControl = this.editarDestinatarioForm.controls[emailDestinatario];
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
    const celularDestinatarioControl = this.editarDestinatarioForm.get('celularDestinatario');
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
    const telefonoDestinatarioControl = this.editarDestinatarioForm.get('telefonoDestinatario');
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

  validaLongitudTelefonos(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const tieneValor = control.value && control.value.trim() !== '';
      const longitudValida = tieneValor ? control.value.length <= 11 : control.value.length <= 9;
      return longitudValida ? null : { 'longitudInvalida': { value: control.value } };
    };
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

  detectarCambios(): void {
    this.editarDestinatarioForm.valueChanges.subscribe(() => {
      this.formChanged = true;
    });
  }

  guardarDestinatario(): Observable<any> {

    this.submitted = true;
  
    // Marca todos los campos del formulario como "touched" para mostrar las validaciones de error
    this.editarDestinatarioForm.markAllAsTouched();
  
    // Valida que 'bancoDestinatario' y 'cuentaDestinatario' sean distintos de 0
    const bancoDestinatarioControl = this.editarDestinatarioForm.get('bancoDestinatario');
    this.bancoInvalido = false;
    if (bancoDestinatarioControl && bancoDestinatarioControl.value === '0') {
      this.bancoInvalido = true;
      return of(null);
    }
  
    // Valida custom-select tipo de cuenta
    const cuentaDestinatarioControl = this.editarDestinatarioForm.get('cuentaDestinatario');
    this.cuentaInvalida = false;
    if (cuentaDestinatarioControl && cuentaDestinatarioControl.value === '0') {
      this.cuentaInvalida = true;
      return of(null);
    }
  
    // Si el formulario es inválido, retorna un Observable que emite null
    if (this.editarDestinatarioForm.invalid) {
      console.log('El formulario es inválido');
      return of(null);
    }
  
    const formValues = this.editarDestinatarioForm.value;
  
    // Elimina los puntos y el guión del RUT
    const rutSinFormato = formValues.rutDestinatario.replace(/\./g, '').replace(/-/g, '');
  
    const datosDestinatarioEditado = {
      id: this.idDestinatarioAeditar.value, // Usa el ID del destinatario que se está editando
      nombre: formValues.nombreDestinatario,
      apodo: formValues.apodoDestinatario,
      rut: rutSinFormato,
      banco: this.listaBancos.find(b => b.value === formValues.bancoDestinatario)?.label ?? this.bancoSeleccionado,
      tipoCuenta: this.tiposCuenta.find(t => t.value === formValues.cuentaDestinatario)?.label ?? this.tipoCuentaSeleccionada,
      numeroCuenta: formValues.numeroCuentaDestinatario,
      email: formValues.emailDestinatario,
      celular: formValues.celularDestinatario.replace(/\s/g, ''),
      telefono: formValues.telefonoDestinatario.replace(/\s/g, '')
    };
  
    console.log('Datos que se enviarán:', datosDestinatarioEditado);
  
    // Envía los datos al servicio
    this.agendaService.emitirDatosNuevoDestinatario(datosDestinatarioEditado);
  
    return of(null);
  }

}
