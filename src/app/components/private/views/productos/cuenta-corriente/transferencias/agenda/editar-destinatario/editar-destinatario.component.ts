import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { RutPipe } from '../../../../../../../../shared/pipes/rut.pipe';
import { CelularPipe } from '../../../../../../../../shared/pipes/celular.pipe';
import { TelefonoFijoPipe } from '../../../../../../../../shared/pipes/telefono-fijo.pipe';
import { FormatoEmailService } from '../../../../../../../../services/formatoEmail.service';
import { AgendaService } from '../../../../../../../../services/agenda.service';
import { Subject } from 'rxjs';

declare var bootstrap: any;

@Component({
  selector: 'mb-editar-destinatario',
  templateUrl: './editar-destinatario.component.html'
})
export class EditarDestinatarioComponent implements OnInit, AfterViewInit {

  @ViewChild('editarDestinatarioCanvas') editarDestinatarioCanvas: ElementRef | undefined;
  //@Output() mostrarBackdropCustomChange = new EventEmitter<boolean>();
  @Output() cancelarEvent = new EventEmitter<void>();

  private dataLoaded = new Subject<void>();

  editarDestinatarioForm: FormGroup = new FormGroup({});
  agenda: any[] = [];
  submitted: boolean = false;
  botonGuardarDisabled: boolean | undefined;
  // Variable validaciones
  inputErrorVacioNombre: any;
  inputErrorApellido: any;
  inputValidoNombre: any;
  inputApodoValido: any;
  inputErrorVacioRut: any;
  inputValidoRut: any;
  inputErrorVacioNumeroCuenta: any;
  inputValidoNumeroCuenta: any;
  inputErrorVacioEmail: any;
  inputValidoEmail: any;
  inputErrorCelularInvalido: any;
  inputCelularValido: any;
  inputErrorTelefonoFijoInvalido: any;
  inputTelefonoFijoValido: any

  // Variables para banco
  banco: any;
  bancoInicio: string | undefined;
  nuevoValorBanco: string | undefined;;

  bancoValido: any;
  bancoInvalido: any;
  bancoInvalidoMensaje: any;

  tipo_cuenta: string | undefined;
  tipoCuentaInicio: string | undefined;
  nuevoValorTipoCuenta: any;
  
  bancoSeleccionado: any;
  bancoSeleccionadoLabel: any;

  // Variables para tipo cuenta
  tipoCuentaSeleccionada: any;
  cuentaValida: any;
  cuentaInvalida: any;
  cuentaInvalidaMensaje: any;
  

  id: number | null = null;

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

  constructor(
    private rutPipe: RutPipe,
    private celularPipe: CelularPipe,
    private telefonoFijoPipe: TelefonoFijoPipe,
    private formatoEmailService: FormatoEmailService,
    private agendaService: AgendaService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.loadData();

    this.agendaService.currentId.subscribe(id => {
      // console.log('ID:', id);
      this.id = id ?? 0;
      this.loadDestinatarioData(this.id);
      console.log('Banco Inicio:', this.bancoInicio);
      console.log('Cuenta Inicio:', this.tipoCuentaInicio);
    });

    this.editarDestinatarioForm = new FormGroup({
      nombre: new FormControl(''),
      apodo: new FormControl(''),
      rut: new FormControl(''),
      banco: new FormControl(''),
      tipo_cuenta: new FormControl(''),
      numero_cuenta: new FormControl(''),
      email: new FormControl(''),
      celular: new FormControl(''),
      telefono: new FormControl(''),
    });

    this.observaDatosCargados();
  }

  ngAfterViewInit() {
    this.dataLoaded.subscribe(() => {
      this.editarDestinatarioForm.valueChanges.subscribe(() => {
        const hasChanges = this.observaDatosCargados();
        this.botonGuardarDisabled = !hasChanges;
        this.cdr.detectChanges();
      });
    });

    this.activarSeleccionBanco();
    this.activarSeleccionCuenta();
  }

  observaBancoInicio(): void {
    const bancoControl = this.editarDestinatarioForm.get('');
    if (bancoControl) {
      this.bancoInicio = bancoControl.value;
      this.nuevoValorBanco = bancoControl.value; // Guardar el texto del label
    }
  }
  
  observaCuentaInicio(): void {
    const cuentaControl = this.editarDestinatarioForm.get('');
    if (cuentaControl) {
      this.tipoCuentaInicio = cuentaControl.value;
      this.nuevoValorTipoCuenta = cuentaControl.value;
    }
  }
  
  activarSeleccionBanco(): void {
    const bancoControl = this.editarDestinatarioForm.get('banco');
    if (bancoControl) {
      bancoControl.valueChanges.subscribe(value => {
        const selectedBanco = this.listaBancos.find(banco => banco.value === value);
        if (selectedBanco) {
          this.bancoInicio = selectedBanco.label;
          this.nuevoValorBanco = selectedBanco.label;
        }
      });
    }
  }
  
  activarSeleccionCuenta(): void {
    const cuentaControl = this.editarDestinatarioForm.get('tipo_cuenta');
    if (cuentaControl) {
      cuentaControl.valueChanges.subscribe(value => {
        const selecteCuenta = this.tiposCuenta.find(tipo_cuenta => tipo_cuenta.value === value);
        if (selecteCuenta) {
          this.tipoCuentaInicio = selecteCuenta.label;
          this.nuevoValorTipoCuenta = selecteCuenta.label; // Guardar el texto del label
          console.log('Cuenta seleccionada:', this.nuevoValorTipoCuenta);
        }
      });
    }
  }

  loadData(): void {
    this.agendaService.getAgenda().subscribe((agenda: any) => {
      // console.log('Agenda:', agenda);
      this.agenda = agenda;
      this.cdr.detectChanges();
    });
  }

  loadDestinatarioData(id: number): void {
    const destinatario = this.agenda.find(item => item.id === id);
    if (destinatario) {
      this.editarDestinatarioForm.patchValue({
        nombre: destinatario.nombre,
        apodo: destinatario.apodo,
        rut: this.rutPipe.transform(destinatario.rut),
        banco: destinatario.banco,
        tipo_cuenta: destinatario.tipo_cuenta,
        numero_cuenta: destinatario.numero_cuenta,
        email: destinatario.email,
        celular: this.celularPipe.transform(destinatario.celular),
        telefono: this.telefonoFijoPipe.transform(destinatario.telefono),
      });

      this.bancoInicio = destinatario.banco;
      this.tipoCuentaInicio = destinatario.tipo_cuenta;
      this.dataLoaded.next(); // Emitir el evento indicando que los datos han sido cargados
    }
  }

  observaDatosCargados(): boolean {
    const initialValues = this.editarDestinatarioForm.getRawValue();
    const currentValues = this.editarDestinatarioForm.getRawValue();
    for (const key in initialValues) {
      if (initialValues.hasOwnProperty(key)) {
        if (initialValues[key] !== currentValues[key]) {
          return true;
        }
      }
    }
    return false;
  }

  validaNombre(): void {
    const nombreControl = this.editarDestinatarioForm.get('nombre');
    if (nombreControl) {
      const nombreDestinatario = nombreControl.value as string;
      const palabras = nombreDestinatario.trim().split(' ');
  
      if (nombreDestinatario.trim() === '') {
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
    const control = this.editarDestinatarioForm.get('apodo');
  
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

  // Solo permite numeros y letra K en el ultimo digito
  formatoRut(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
  
    // Verificar si el valor contiene '.' o '-'
    if (value.includes('.') || value.includes('-')) {
      // Permitir la entrada sin restricciones adicionales
      return true;
    }
  
    // Aplicar restricciones de entrada de caracteres
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      if (charCode === 75 || charCode === 107) { // 'K' o 'k'
        return value.length === 8;
      }
      if (charCode === 46 || charCode === 45) { // '.' o '-'
        return true;
      }
      return false;
    }
  
    // Aplicar la lógica de validación del RUT
    setTimeout(() => {
      const rut = this.rutPipe.transform(value);
      const digitos = rut.replace(/[^0-9]/g, '').length;
      if (digitos < 8 || digitos > 9) {
        inputElement.setCustomValidity('RUT inválido');
      } else {
        inputElement.value = rut;
        inputElement.setCustomValidity('');
      }
    }, 0);
  
    return true;
  }

  validaRut(): void {
    const rutDestinatarioControl = this.editarDestinatarioForm.get('rut');
    if (rutDestinatarioControl) {
      const rutDestinatario = rutDestinatarioControl.value as any;
  
      if (rutDestinatario.trim() === '') {
        rutDestinatarioControl.setErrors({ 'inputErrorVacioRut': true });
      } else if (rutDestinatario.length < 8 || rutDestinatario.length > 12) {
        rutDestinatarioControl.setErrors({ 'inputErrorFormatoRut': true });
      } else {
        rutDestinatarioControl.setErrors(null);
        if (!rutDestinatario.includes('.') && !rutDestinatario.includes('-')) {
          rutDestinatarioControl.setValue(this.rutPipe.transform(rutDestinatario));
        }
      }
  
      this.inputErrorVacioRut = rutDestinatarioControl.errors?.['inputErrorVacioRut'];
      this.inputValidoRut = rutDestinatarioControl.valid;
    }
  }

  resetRut(): void {
    const userNameControl = this.editarDestinatarioForm.get('rut');
    if (userNameControl) {
      userNameControl.setErrors(null);
      userNameControl.reset();
    }
  }

  validaNumeroCuenta(): void {
    const numeroCuentaControl = this.editarDestinatarioForm.get('numero_cuenta');
    if (numeroCuentaControl) {
      const numero_cuenta = numeroCuentaControl.value as string;
  
      if (numero_cuenta.trim() === '') {
        numeroCuentaControl.setErrors({ 'inputErrorVacioNumeroCuenta': true });
      } else {
        numeroCuentaControl.setErrors(null);
      }
  
      this.inputErrorVacioNumeroCuenta = numeroCuentaControl.errors?.['inputErrorVacioNumeroCuenta'];
      this.inputValidoNumeroCuenta = numeroCuentaControl.valid;
    }
    
  }

  validaEmail(emailDestinatario: string) {
    const emailControl = this.editarDestinatarioForm.controls[emailDestinatario];
    emailControl.markAsTouched();
    emailControl.setValidators([Validators.required, Validators.email, this.formatoEmailService.formatoEmail]);
    emailControl.updateValueAndValidity();
  
    if (emailControl.value.trim() === '') {
      emailControl.setErrors({ 'required': true });
    } else if (emailControl.errors?.['email'] || emailControl.errors?.['email']) {
      emailControl.setErrors({ 'customEmail': true });
    } else {
      emailControl.setErrors(null);
    }
  
    this.inputValidoEmail = emailControl.valid;
  }

  validaCelular(): void {
    const celularControl = this.editarDestinatarioForm.get('celular');
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
    const telefonoControl = this.editarDestinatarioForm.get('telefono');
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

  validaLongitudTelefonos(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const tieneValor = control.value && control.value.trim() !== '';
      const longitudValida = tieneValor ? control.value.length <= 11 : true;
      return longitudValida ? null : { 'longitudInvalida': { id: 0, value: control.value } };
    };
  }
  
  soloNumeros(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  actualizarDestinatario(): void {
    if (this.editarDestinatarioForm.valid) {
      const destinatarioData = this.editarDestinatarioForm.getRawValue();
  
      // Reemplazar caracteres no deseados en el RUT
      if (destinatarioData.rut) {
        destinatarioData.rut = destinatarioData.rut.replace(/[.-]/g, '');
      }
  
      // Asignar el texto del label de banco y tipo de cuenta
      destinatarioData.banco = this.nuevoValorBanco || this.bancoInicio;
      destinatarioData.tipo_cuenta = this.nuevoValorTipoCuenta || this.tipoCuentaInicio;
  
      console.log('Datos enviados al servicio:', destinatarioData);
      if (this.id !== null) {
        console.log('ID del destinatario:', this.id); 
        this.agendaService.guardarDestinatarioEditado(this.id, destinatarioData).subscribe(
          response => {
            console.log('Destinatario actualizado:', response);
          },
          error => {
            console.error('Error al actualizar destinatario:', error);
          }
        );
      } else {
        console.error('ID del destinatario no encontrado');
      }
    } else {
      console.error('Formulario inválido');
    }
    //this.mostrarBackdropCustomChange.emit(false);
  }
  

  cancelar(): void {
    this.editarDestinatarioForm.reset();
    Object.keys(this.editarDestinatarioForm.controls).forEach(key => {
      const control = this.editarDestinatarioForm.get(key);
      if (control !== null) {
        control.clearValidators();
        control.updateValueAndValidity();
      }
    });

    this.cancelarEvent.emit();
  }

}