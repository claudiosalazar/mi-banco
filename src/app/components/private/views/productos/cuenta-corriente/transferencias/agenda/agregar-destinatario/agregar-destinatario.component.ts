import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// Services
import { FormatoEmailService } from '../../../../../../../../services/formatoEmail.service';
import { AgendaService } from '../../../../../../../../services/agenda.service';
import { ValidaRutService } from '../../../../../../../../services/validaRut.service';

// Pipe
import { RutPipe } from '../../../../../../../../shared/pipes/rut.pipe';
import { CelularPipe } from '../../../../../../../../shared/pipes/celular.pipe';
import { TelefonoFijoPipe } from '../../../../../../../../shared/pipes/telefono-fijo.pipe';

// Model
import { Agenda } from '../../../../../../../../models/agenda.model';

@Component({
  selector: 'mb-agregar-destinatario',
  templateUrl: './agregar-destinatario.component.html'
})
export class AgregarDestinatarioComponent implements OnInit {

  @Output() nuevoDestinatarioGuardado = new EventEmitter<void>();
  @Output() cancelarEvent = new EventEmitter<void>();

  agenda: any[] = [];
  allIds: number[] = [];
  datosNuevoDestinatario: any;

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

  // Variable para nombre
  inputErrorVacioNombre: any;
  inputErrorApellido: any;
  inputValidoNombre: any;
  // Variables para apodo
  inputApodoValido: any;
  // Variables para rut
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
  mostrarFormulario = true;


  constructor(
    private agendaService: AgendaService,
    private formatoEmailService: FormatoEmailService,
    private rutPipe: RutPipe,
    private celularPipe: CelularPipe,
    private telefonoFijoPipe: TelefonoFijoPipe,
    private validaRutService: ValidaRutService
   ) {}

  ngOnInit(): void {
    this.loadData();
    this.crearDestinatarioForm = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      apodo: new FormControl(''),
      rut: new FormControl('', [Validators.required]),
      banco: new FormControl('', [Validators.required]),
      tipo_cuenta: new FormControl('', [Validators.required]),
      numero_cuenta: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      celular: new FormControl(''),
      telefono: new FormControl(''),
    });
  }

  loadData(): void {
    // Obtener los datos de la agenda del usuario autenticado
    this.agendaService.getAgenda().subscribe((agenda: any) => {
      this.agenda = agenda;
      this.allIds = agenda.map((item: Agenda) => item.id_agenda); // Almacena todos los IDs del usuario autenticado
      // console.log('Datos obtenidos del usuario autenticado:', agenda); // Muestra los datos en la consola
  
      // Obtener todos los datos de la agenda
      this.agendaService.getAgendaAll().subscribe((allAgenda: any) => {
        const allAgendaIds = allAgenda.map((item: Agenda) => item.id_agenda); // Almacena todos los IDs
        localStorage.setItem('allAgendaIds', JSON.stringify(allAgendaIds)); // Guarda todos los IDs en el almacenamiento local
        // console.log('Todos los datos obtenidos:', allAgenda); // Muestra todos los datos en la consola
      });
    });
  }

  // Solo permite ingresar números en los campos de texto
  soloNumeros(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  resetRut(): void {
    const rutDestinatarioControl = this.crearDestinatarioForm.get('rut');
    if (rutDestinatarioControl) {
      rutDestinatarioControl.setValue(''); // Limpiar el campo de entrada
      rutDestinatarioControl.markAsPristine(); // Marcar como pristine
      rutDestinatarioControl.markAsUntouched(); // Marcar como untouched
      rutDestinatarioControl.updateValueAndValidity(); // Actualizar el estado del control
    }
  }
  
  validaRut(): void {
    const rutDestinatarioControl = this.crearDestinatarioForm.get('rut');
    if (rutDestinatarioControl) {
      const rutDestinatario = rutDestinatarioControl.value as any;
  
      if (rutDestinatario.trim() === '') {
        rutDestinatarioControl.setErrors({ 'inputErrorVacioRut': true });
      } else {
        // Eliminar caracteres no numéricos y obtener el cuerpo y el dígito verificador
        const rutSinFormato = rutDestinatario.replace(/[^0-9kK]/g, '');
        const cuerpo = rutSinFormato.slice(0, -1);
        const dv = rutSinFormato.slice(-1).toLowerCase();
  
        if (cuerpo.length < 7 || cuerpo.length > 8) {
          rutDestinatarioControl.setErrors({ 'inputErrorFormatoRut': true });
        } else {
          const dvCalculado = this.validaRutService.calcularVerificador(cuerpo);
  
          if (dv !== dvCalculado) {
            rutDestinatarioControl.setErrors({ 'inputErrorFormatoRut': true });
          } else {
            rutDestinatarioControl.setErrors(null);
  
            // Detectar el formato del RUT ingresado
            const tienePunto = rutDestinatario.includes('.');
            const tieneGuion = rutDestinatario.includes('-');
  
            if (!tienePunto && !tieneGuion) {
              // Sin '.' ni '-'
              rutDestinatarioControl.setValue(this.rutPipe.transform(rutDestinatario));
            } else if (tienePunto && !tieneGuion) {
              // Con '.' pero sin '-'
              const rutConGuion = `${rutDestinatario.slice(0, -1)}-${rutDestinatario.slice(-1)}`;
              rutDestinatarioControl.setValue(rutConGuion);
            } else if (!tienePunto && tieneGuion) {
              // Sin '.' pero con '-'
              const partes = rutDestinatario.split('-');
              let cuerpo = partes[0];
              const dv = partes[1];
            
              // Agregar puntos en las posiciones adecuadas
              if (cuerpo.length === 7) {
                cuerpo = `${cuerpo.slice(0, 1)}.${cuerpo.slice(1, 4)}.${cuerpo.slice(4)}`;
              } else if (cuerpo.length === 8) {
                cuerpo = `${cuerpo.slice(0, 2)}.${cuerpo.slice(2, 5)}.${cuerpo.slice(5)}`;
              }
            
              rutDestinatarioControl.setValue(`${cuerpo}-${dv}`);
            }
          }
        }
      }
  
      this.inputValidoRut = rutDestinatarioControl.valid;
    }
  }

  validaNombre(): void {
    const nombreDestinatarioControl = this.crearDestinatarioForm.get('nombre');
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
    const numeroCuentaDestinatarioControl = this.crearDestinatarioForm.get('numero_cuenta');
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
    emailControl.setValidators([Validators.required, Validators.email, this.formatoEmailService.formatoEmail]);
    emailControl.updateValueAndValidity();
  
    if (emailControl.value.trim() !== '') {
      emailControl.markAsTouched();
  
      if (emailControl.errors?.['email'] || emailControl.errors?.['email']) {
        emailControl.setErrors({ 'email': true });
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
    const celularDestinatarioControl = this.crearDestinatarioForm.get('celular');
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
    const telefonoDestinatarioControl = this.crearDestinatarioForm.get('telefono');
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

  enviarDatosNuevoDestinatario(): void {
    this.submitted = true;
  
    // Verifica que todos los campos del formulario estén llenos
    this.crearDestinatarioForm.markAllAsTouched();
  
    // Verifica que el formulario sea válido
    if (this.crearDestinatarioForm.valid) {
      const formValues = this.crearDestinatarioForm.value;
  
      // Elimina los puntos y el guión del RUT
      const rutSinFormato = formValues.rut.replace(/\./g, '').replace(/-/g, '');
      const id_user = Number(localStorage.getItem('id_user'));
      const datosNuevoDestinatario: Agenda = {
        id_agenda: null,
        id_user: id_user,
        nombre: formValues.nombre,
        apodo: formValues.apodo,
        rut: rutSinFormato,
        banco: this.listaBancos.find(b => b.value === formValues.banco)?.label ?? '',
        tipo_cuenta: this.tiposCuenta.find(t => t.value === formValues.tipo_cuenta)?.label ?? '',
        numero_cuenta: formValues.numero_cuenta,
        email: formValues.email,
        celular: formValues.celular.replace(/\s/g, ''),
        telefono: formValues.telefono.replace(/\s/g, '')
      };
  
      // Obtener todos los IDs de agenda desde el almacenamiento local
      const allAgendaIds = JSON.parse(localStorage.getItem('allAgendaIds') || '[]');
      
      // Generar un nuevo ID único
      const nuevoId = Math.max(...allAgendaIds) + 1;
      datosNuevoDestinatario.id_agenda = nuevoId;
  
      // console.log('Datos que se enviarán:', datosNuevoDestinatario);
  
      // Envía los datos al servicio
      this.agendaService.emitirDatosNuevoDestinatario(datosNuevoDestinatario);
    }
  }

  cancelar(): void {
    this.crearDestinatarioForm.reset();
    Object.keys(this.crearDestinatarioForm.controls).forEach(key => {
      const control = this.crearDestinatarioForm.get(key);
      if (control !== null) {
        control.clearValidators();
        control.updateValueAndValidity();
      }
    });

    this.cancelarEvent.emit();
  }

  ngOnDestroy(): void {
    // console.log('Componente AgregarDestinatario destruido');
  }

}