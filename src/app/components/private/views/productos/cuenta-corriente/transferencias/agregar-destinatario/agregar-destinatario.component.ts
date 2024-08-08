import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { AgendaService } from '../../../../../../../services/agenda.service';
import { FormatoEmailService } from '../../../../../../../services/formatoEmail.service';
import { RutPipe } from '../../../../../../../shared/pipes/rut.pipe';
import { CelularPipe } from './../../../../../../../shared/pipes/celular.pipe';
import { TelefonoFijoPipe } from './../../../../../../../shared/pipes/telefono-fijo.pipe';

@Component({
  selector: 'mb-agregar-destinatario',
  templateUrl: './agregar-destinatario.component.html'
})
export class AgregarDestinatarioComponent implements OnInit {

  @ViewChild('crearDestinatarioCanvas') crearDestinatarioCanvas: ElementRef | undefined;
  @Output() mostrarBackdropCustomChange = new EventEmitter<boolean>();

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

  crearDestinatarioForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  campoVacio: boolean = false;
  datoValido: boolean = false;
  nombre: any;
  rut: any;
  numero_cuenta: any;
  email: any;
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

  // Variables para banco
  banco: any;
  valorBancoInicial: any | undefined;
  nuevoValorBanco: string | null = null;
  bancoSeleccionado: any | undefined;
  bancoValido: any;
  bancoInvalido: any;
  bancoInvalidoMensaje: any;

  // Variables para tipo cuenta
  tipoCuenta: any;
  valorTipoCuentaInicial: any | undefined;
  nuevoValorTipoCuenta: string | null = null;
  tipoCuentaSeleccionada: any | undefined;
  cuentaValida: any;
  cuentaInvalida: any;
  cuentaInvalidaMensaje: any;

  botonGuardarDisabled = false;

  constructor(
    private agendaService: AgendaService,
    private formatoEmailService: FormatoEmailService,
    private rutPipe: RutPipe,
    private celularPipe: CelularPipe,
    private telefonoFijoPipe: TelefonoFijoPipe
   ) {}

  ngOnInit(): void {
    this.crearDestinatarioForm = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      apodoDestinatario: new FormControl(''),
      rut: new FormControl('', [Validators.required]),
      banco: new FormControl('0', [Validators.required]),
      tipo_cuenta: new FormControl('0', [Validators.required]),
      numero_cuenta: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      celular: new FormControl(''),
      telefono: new FormControl(''),
    });
  }

  ngAfterViewInit(): void {
    // Elmina backdrop de offcanvas y modal
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const backdropOffcanvas = document.querySelector('.offcanvas-backdrop.fade.show');
          if (backdropOffcanvas && backdropOffcanvas.parentNode) {
            backdropOffcanvas.parentNode.removeChild(backdropOffcanvas);
            console.log('El backdrop ha sido eliminado');
          }
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  validaNombre(): void {
    const nombreControl = this.crearDestinatarioForm.get('nombre');
    if (nombreControl) {
      const nombre = nombreControl.value as string;
      const palabras = nombre.trim().split(' ');
  
      if (nombre.trim() === '') {
        nombreControl.setErrors({ 'inputErrorVacioNombre': true });
      } else if (palabras.length === 1) {
        nombreControl.setErrors({ 'inputErrorApellido': true });
      } else {
        nombreControl.setErrors(null);
      }
  
      this.inputErrorVacioNombre = nombreControl.errors?.['inputErrorVacioNombre'];
      this.inputErrorApellido = nombreControl.errors?.['inputErrorApellido'];
      this.inputValidoNombre = nombreControl.valid;
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
    const rutControl = this.crearDestinatarioForm.get('rut');
    if (rutControl) {
      const rut = rutControl.value as any;
  
      if (rut.trim() === '') {
        rutControl.setErrors({ 'inputErrorVacioRut': true });
      } else if (rut.length < 8 || rut.length > 9) {
        rutControl.setErrors({ 'inputErrorFormatoRut': true });
      } else {
        rutControl.setErrors(null);
        rutControl.setValue(this.rutPipe.transform(rut));
      }
  
      this.inputErrorVacioRut = rutControl.errors?.['inputErrorVacioRut'];
      this.inputValidoRut = rutControl.valid;
    }
  }

  editarDatos() {
    this.activarSeleccionBanco();
    this.activarSeleccionTipoCuenta();

    this.observarCambioBanco();
    this.observarCambioTipoCuenta();
  }

  activarSeleccionBanco(): void {
    this.crearDestinatarioForm.get('regionPersonal')?.valueChanges.subscribe(value => {
      this.bancoSeleccionado = this.listaBancos.find(listaBancos => listaBancos.value === value)?.label;
    });
  }

  activarSeleccionTipoCuenta(): void {
    this.crearDestinatarioForm.get('tipo_cuenta')?.valueChanges.subscribe(value => {
      this.tipoCuentaSeleccionada = this.tiposCuenta.find(tiposCuenta => tiposCuenta.value === value)?.label;
    });
  }

  observarCambioBanco(): void {
    const control = this.crearDestinatarioForm.get('banco');
    control?.valueChanges.subscribe(value => {
      this.nuevoValorBanco = value;
      if (this.nuevoValorBanco !== this.valorBancoInicial) {
        this.validaBanco();
      }
    });
  }

  // Valida banco
  validaBanco(): void {
    if (this.nuevoValorBanco === '0') {
      this.bancoValido = false;
      this.bancoInvalido = true;
      this.bancoInvalidoMensaje = true;
    } else {
      this.bancoValido = true;
      this.bancoInvalido = false;
      this.bancoInvalidoMensaje = false;
    }
  }

  observarCambioTipoCuenta(): void {
    const control = this.crearDestinatarioForm.get('tipo_cuenta');
    control?.valueChanges.subscribe(value => {
      this.nuevoValorTipoCuenta = value;
      if (this.nuevoValorTipoCuenta !== this.valorTipoCuentaInicial) {
        this.validaTipoCuenta();
      }
    });
  }

  // Valida tipo cuenta
  validaTipoCuenta(): void {
    if (this.nuevoValorTipoCuenta === '0') {
      this.cuentaValida = false;
      this.cuentaInvalida = true;
      this.cuentaInvalidaMensaje = true;
    } else {
      this.cuentaValida = true;
      this.cuentaInvalida = false;
      this.cuentaInvalidaMensaje = false;
    }
  }

  validaNumeroCuenta(): void {
    const numero_cuentaControl = this.crearDestinatarioForm.get('numero_cuenta');
    if (numero_cuentaControl) {
      const numero_cuenta = numero_cuentaControl.value as string;
  
      if (numero_cuenta.trim() === '') {
        numero_cuentaControl.setErrors({ 'inputErrorVacioNumeroCuenta': true });
      } else {
        numero_cuentaControl.setErrors(null);
      }
  
      this.inputErrorVacioNumeroCuenta = numero_cuentaControl.errors?.['inputErrorVacioNumeroCuenta'];
      this.inputValidoNumeroCuenta = numero_cuentaControl.valid;
    }
    
  }

  validaEmail(email: string) {
    const emailControl = this.crearDestinatarioForm.controls[email];
    emailControl.setValidators([Validators.required, Validators.email, this.formatoEmailService.formatoEmail]);
    emailControl.updateValueAndValidity();
  
    if (emailControl.value.trim() !== '') {
      emailControl.markAsTouched();
  
      if (emailControl.errors?.['email'] || emailControl.errors?.['customEmail']) {
        emailControl.setErrors({ 'customEmail': true });
      } else {
        emailControl.setErrors(null);
      }
  
      this.inputValidoEmail = emailControl.valid;
    } else {
      emailControl.markAsUntouched();
      emailControl.setErrors(null);
      this.inputValidoEmail = null;
    }
  
    this.verificarFormulario();
  }

  validaCelular(): void {
    const celularControl = this.crearDestinatarioForm.get('celular');
    if (celularControl) {
      let value = celularControl.value as string;
  
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
        celularControl.setValue(value);
      }
  
      // Cambiar la cantidad de caracteres del input de 9 a 11 después de aplicar el pipe
      if (this.inputCelularValido) {
        celularControl.setValidators([Validators.minLength(11), Validators.maxLength(11)]);
      } else {
        celularControl.setValidators([Validators.minLength(9), Validators.maxLength(9)]);
      }
  
      celularControl.updateValueAndValidity();
      celularControl.markAsTouched(); // Marcar el campo como 'touched' después de la validación
    }
  }

  validaTelefono(): void {
    const telefonoControl = this.crearDestinatarioForm.get('telefono');
    if (telefonoControl) {
      let value = telefonoControl.value as string;
  
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
        telefonoControl.setValue(value);
      }
  
      // Cambiar la cantidad de caracteres del input de 9 a 11 después de aplicar el pipe
      if (this.inputTelefonoFijoValido) {
        telefonoControl.setValidators([Validators.minLength(11), Validators.maxLength(11)]);
      } else {
        telefonoControl.setValidators([Validators.minLength(9), Validators.maxLength(9)]);
      }
  
      telefonoControl.updateValueAndValidity();
      telefonoControl.markAsTouched(); // Marcar el campo como 'touched' después de la validación
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

  // Nuevo método para verificar si todos los campos requeridos han sido tocados y son válidos
  verificarFormulario(): void {
    const { nombre, rut, banco, tipo_cuenta, numero_cuenta, email } = this.crearDestinatarioForm.controls;

    // Si todos los campos han sido tocados y son válidos, habilitar el botón de guardar
    if (nombre.touched && rut.touched && banco.touched && tipo_cuenta.touched && numero_cuenta.touched && email.touched &&
        nombre.valid && rut.valid && numero_cuenta.valid && email.valid) {
      this.botonGuardarDisabled = false;
    } else {
      this.botonGuardarDisabled = true;
    }
  }

  validaFormulario(): Observable<any> {

    this.submitted = true;
  
    // Verifica que todos los campos del formulario estén llenos
    this.crearDestinatarioForm.markAllAsTouched();
  
    // Verifica que el formulario sea válido
    if (this.crearDestinatarioForm.valid) {
      this.agendaService.getAgenda().subscribe(agenda => {
        const maxId = Math.max(...agenda.map((d: { id: any; }) => Number(d.id)).filter((id: number) => !isNaN(id)));
        const newId = maxId + 1;
        const formValues = this.crearDestinatarioForm.value;
  
        // Elimina los puntos y el guión del RUT
        const rutSinFormato = formValues.rut.replace(/\./g, '').replace(/-/g, '');
  
        this.datosNuevoDestinatario = {
          id: newId.toString(),
          nombre: formValues.nombre,
          apodo: formValues.apodoDestinatario,
          rut: rutSinFormato,
          banco: this.listaBancos.find(b => b.value === formValues.banco)?.label ?? '',
          tipoCuenta: this.tiposCuenta.find(t => t.value === formValues.tipo_cuenta)?.label ?? '',
          numeroCuenta: formValues.numero_cuenta,
          email: formValues.email,
          celular: formValues.celular.replace(/\s/g, ''),
          telefono: formValues.telefono.replace(/\s/g, '')
        };
  
        console.log('Datos que se enviarán:', this.datosNuevoDestinatario);
  
        // Envía los datos al servicio
        // this.agendaService.emitirDatosNuevoDestinatario(this.datosNuevoDestinatario);
  
        // Aquí cambias el valor de mostrarBackdropCustomChange a false
        this.mostrarBackdropCustomChange.emit(false);
      });
    }
    return of(null);
  }

  cancelar(): void {
    // Emite el evento para ocultar el backdrop
    this.mostrarBackdropCustomChange.emit(false);
  
    // Resetea el formulario
    this.crearDestinatarioForm.reset();
  
    // Limpia las validaciones
    Object.keys(this.crearDestinatarioForm.controls).forEach(key => {
      const control = this.crearDestinatarioForm.get(key);
      control?.clearValidators();
      control?.updateValueAndValidity();
    });
  
    // Verifica si los controles existen antes de intentar establecer su valor
    if (this.crearDestinatarioForm.controls['banco']) {
      this.crearDestinatarioForm.controls['banco'].setValue(0, {onlySelf: true});
    }
  
    if (this.crearDestinatarioForm.controls['tipo_cuentas']) {
      this.crearDestinatarioForm.controls['tipo_cuentas'].setValue(0, {onlySelf: true});
    }
  
    // Establece 'bancoSeleccionado' y 'tipoCuentaSeleccionada' a '-'
    this.bancoSeleccionado = '-';
    this.tipoCuentaSeleccionada = '-';

    // Resetea el control 'email' y actualiza su estado de validez
    const emailControl = this.crearDestinatarioForm.controls['email'];
    emailControl.reset();
    emailControl.markAsPristine();
    emailControl.markAsUntouched();
    emailControl.updateValueAndValidity();

    // Establece 'inputValidoEmail' a null para que la clase 'is-valid' no se aplique
    this.inputValidoEmail = null;

  }

}
