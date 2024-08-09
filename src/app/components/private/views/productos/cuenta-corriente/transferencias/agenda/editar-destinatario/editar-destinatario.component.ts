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
  @Output() mostrarBackdropCustomChange = new EventEmitter<boolean>();

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
  tipo_cuenta: any;
  valorBancoInicial: any | undefined;
  nuevoValorBanco: string | null = null;
  bancoSeleccionado: any | undefined;
  bancoValido: any;
  bancoInvalido: any;
  bancoInvalidoMensaje: any;
  bancoInicio: any;
  tipoCuentaInicio: any;

  // Variables para tipo cuenta
  tipoCuenta: any;
  valorTipoCuentaInicial: any | undefined;
  nuevoValorTipoCuenta: string | null = null;
  tipoCuentaSeleccionada: any | undefined;
  cuentaValida: any;
  cuentaInvalida: any;
  cuentaInvalidaMensaje: any;

  bancoSeleccionadoLabel: string | undefined;

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
      console.log('ID:', id);
      this.id = id ?? 0;
      this.loadDestinatarioData(this.id);
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
  }

  loadData(): void {
    this.agendaService.getAgenda().subscribe((agenda: any) => {
      console.log('Agenda:', agenda);
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
      console.log('Banco:', this.bancoInicio);
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

  observaBancoInicio(): void {
    const bancoControl = this.editarDestinatarioForm.get('banco');
    if (bancoControl) {
      bancoControl.valueChanges.subscribe(nuevoBanco => {
        const bancoSeleccionado = this.listaBancos.find(banco => banco.value === nuevoBanco);
        if (bancoSeleccionado) {
          this.bancoInicio = bancoSeleccionado.label;
          console.log('Nuevo Banco Inicio:', this.bancoInicio);
        }
      });
    }
  }

  observaCuentaInicio(): void {
    const cuentaControl = this.editarDestinatarioForm.get('tipo_cuenta');
    if (cuentaControl) {
      cuentaControl.valueChanges.subscribe(nuevaCuenta => {
        const cuentaSeleccionada = this.tiposCuenta.find(tipo_cuenta => tipo_cuenta.value === nuevaCuenta);
        if (cuentaSeleccionada) {
          this.tipoCuentaInicio = cuentaSeleccionada.label;
          console.log('Nuevo Banco Inicio:', this.tipoCuentaInicio);
        }
      });
    }
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

  validaRut(): void {
    const rutControl = this.editarDestinatarioForm.get('rut');
    if (rutControl) {
      const rutDestinatario = rutControl.value as any;
  
      if (rutDestinatario.trim() === '') {
        rutControl.setErrors({ 'inputErrorVacioRut': true });
      } else if (rutDestinatario.length < 8 || rutDestinatario.length > 9) {
        rutControl.setErrors({ 'inputErrorFormatoRut': true });
      } else {
        rutControl.setErrors(null);
        rutControl.setValue(this.rutPipe.transform(rutDestinatario));
      }
  
      this.inputErrorVacioRut = rutControl.errors?.['inputErrorVacioRut'];
      this.inputValidoRut = rutControl.valid;
    }
  }

  formatoRut(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    const value = (event.target as HTMLInputElement).value;
  
    // Permitir solo números
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      if (charCode === 75 || charCode === 107) {
        return value.length === 8;
      }
      return false;
    }
    return true;
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
  
      // Eliminar caracteres '.' y '-' del campo 'rut'
      if (destinatarioData.rut) {
        destinatarioData.rut = destinatarioData.rut.replace(/[.-]/g, '');
      }
  
      console.log('Datos enviados al servicio:', destinatarioData);
      if (this.id !== null) {
        console.log('ID del destinatario:', this.id); // Verifica el ID antes de enviar
        this.agendaService.actualizarIdDestinatario(this.id, destinatarioData).subscribe(
          response => {
            console.log('Destinatario actualizado:', response);
            // Lógica adicional después de la actualización
            // alert('Destinatario actualizado exitosamente');
            // this.router.navigate(['/ruta-deseada']);
          },
          error => {
            console.error('Error al actualizar destinatario:', error);
            // alert('Hubo un error al actualizar el destinatario. Por favor, inténtelo de nuevo.');
          }
        );
      } else {
        console.error('ID del destinatario no encontrado');
        // alert('No se pudo encontrar el ID del destinatario. Por favor, inténtelo de nuevo.');
      }
    } else {
      console.error('Formulario inválido');
      // alert('El formulario contiene errores. Por favor, corríjalos antes de enviar.');
    }
    this.mostrarBackdropCustomChange.emit(false);
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
    this.mostrarBackdropCustomChange.emit(false);
  }

}