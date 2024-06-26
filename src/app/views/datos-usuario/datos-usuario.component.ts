import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// Services
import { DatosUsuarioService, ListaGeograficaService, ListaGeograficaComercialService } from '../../core/services/datos-usuario.service';
import { FormatoEmailService } from '../../core/services/formato-email.service';
import { BackdropService } from '../../core/services/backdrop.service';

// Pipe
import { RutPipe } from '../../shared/pipes/rut.pipe';
import { CelularPipe } from '../../shared/pipes/celular.pipe';
import { TelefonoFijoPipe } from '../../shared/pipes/telefono-fijo.pipe';

declare var bootstrap: any;

import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-datos-usuario',
  templateUrl: './datos-usuario.component.html'
})
export class DatosUsuarioComponent implements OnInit{


  listaRegiones: any[] = [];
  listaCiudad: any[] = [];
  listaComuna: any[] = [];
  listaRegionesComercial: any[] = [];
  listaCiudadComercial: any[] = [];
  listaComunaComercial: any[] = [];

  regionSeleccionadaPersonalInicial: any | undefined;
  regionSeleccionadaPersonal: any | undefined;
  ciudadSeleccionadaPersonalInicial: any | undefined;
  ciudadSeleccionadaPersonal: any | undefined;
  comunaSeleccionadaPersonalInicial: any | undefined;
  comunaSeleccionadaPersonal: any | undefined;

  regionSeleccionadaComercialInicial: any | undefined;
  regionSeleccionadaComercial: any | undefined;
  ciudadSeleccionadaComercialInicial: any | undefined;
  ciudadSeleccionadaComercial: any | undefined;
  comunaSeleccionadaComercialInicial: any | undefined;
  comunaSeleccionadaComercial: any | undefined;

  mostrarBackdropCustomModal = false;
  modales: any[] = [];

  misDatosForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  //datosUsuario: any;
  primerNombre: any;
  segundoNombre: any;
  apellidoPaterno: any;
  apellidoMaterno: any;
  rut: any;
  fechaNacimiento: any;
  email: any;
  emailComercial: any;
  celular: any;
  telefono: any;
  callePersonal: any;
  numeroPersonal: any;
  deptoVillaBlockPersonal: any;
  regionPersonal: any;
  ciudadPersonal: any;
  comunaPersonal: any;
  calleComercial: any;
  numeroComercial: any;
  oficina: any;
  regionComercial: any;
  ciudadComercial: any;
  comunaComercial: any;

  mensajeInformativo = false;
  separadorBotonGuardar = false;
  botonGuardar = false;
  customSelectDisabled: boolean = true;

  // Variable para region personal
  customRegionPersonalValido: boolean | null = null;
  customRegionPersonalInvalido: boolean | null = null;
  customRegionPersonalInvalidoMensaje: boolean | null = null;

  // Variable para ciudad personal
  customCiudadPersonalValido: boolean | null = null;
  customCiudadPersonalInvalido: boolean | null = null;
  customCiudadPersonalInvalidoMensaje: boolean | null = null;

  // Variable para comuna personal
  customComunaPersonalValido: boolean | null = null;
  customComunaPersonalInvalido: boolean | null = null;
  customComunaPersonalInvalidoMensaje: boolean | null = null;

  // Variable para region comercial
  customRegionComercialValido: boolean | null = null;
  customRegionComercialInvalido: boolean | null = null;
  customRegionComercialInvalidoMensaje: boolean | null = null;

  // Variable para ciudad comercial
  customCiudadComercialValido: boolean | null = null;
  customCiudadComercialInvalido: boolean | null = null;
  customCiudadComercialInvalidoMensaje: boolean | null = null;

  // Variable para comuna comercial
  customComunaComercialValido: boolean | null = null;
  customComunaComercialInvalido: boolean | null = null;
  customComunaComercialInvalidoMensaje: boolean | null = null;

  nuevoValorRegionPersonal: any;
  nuevoValorCiudadPersonal: any;
  nuevoValorComunaPersonal: any;
  nuevoValorRegionComercial: any;
  nuevoValorCiudadComercial: any;
  nuevoValorComunaComercial: any;

  inputValido: any;
  inputVacio: any;
  valoresIniciales: { [key: string]: any } = {};

  // Variables para email
  inputErrorVacioEmail: any;
  inputValidoEmail: any;
  // Variables para celular
  inputErrorCelularInvalido: any;
  inputErrorCelularVacio: any;
  inputCelularValido: any;
  // Variables para telefono fijo
  inputErrorTelefonoInvalido: any;
  inputErrorTelefonoVacio: any;
  inputTelefonoValido: any;

  botonGuardarDisabled = false;

  private cambiosDetectados = false;

  datosUsuarioEditado: any;
  botonEditar = false;

  // Variables modal
  actualizarDatosUsuario = true;
  datosGuardadosUsuarioEditado = false;
  errorServerAlGuardarDatos = false;

  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private listaGeograficaService: ListaGeograficaService,
    private listaGeograficaComercialService: ListaGeograficaComercialService,
    private rutPipe: RutPipe,
    private formatoEmailService: FormatoEmailService,
    private celularPipe: CelularPipe,
    private telefonoFijoPipe: TelefonoFijoPipe,
    private backdropService: BackdropService,
  ) { }

  ngOnInit() {
    this.getDatosActuales();
    this.misDatosForm = new FormGroup({
      primerNombre: new FormControl({value: '', disabled: true}, [Validators.required]),
      segundoNombre: new FormControl({value: '', disabled: true}, [Validators.required]),
      apellidoPaterno: new FormControl({value: '', disabled: true}, [Validators.required]),
      apellidoMaterno: new FormControl({value: '', disabled: true}, [Validators.required]),
      rut: new FormControl({value: '', disabled: true}),
      email: new FormControl({value: '', disabled: true}, [Validators.required]),
      emailComercial: new FormControl({value: '', disabled: true}, [Validators.required]),
      celular: new FormControl({value: '', disabled: true}, [Validators.required]),
      telefono: new FormControl({value: '', disabled: true}, [Validators.required]),
      callePersonal: new FormControl({value: '', disabled: true}, [Validators.required]),
      numeroPersonal: new FormControl({value: '', disabled: true}, [Validators.required]),
      deptoVillaBlockPersonal: new FormControl({value: '', disabled: true}, [Validators.required]),
      regionPersonal: new FormControl('', [Validators.required]),
      ciudadPersonal: new FormControl('', [Validators.required]),
      comunaPersonal: new FormControl('', [Validators.required]),
      calleComercial: new FormControl({value: '', disabled: true}, [Validators.required]),
      numeroComercial: new FormControl({value: '', disabled: true}, [Validators.required]),
      oficina: new FormControl({value: '', disabled: true}, [Validators.required]),
      regionComercial: new FormControl('', [Validators.required]),
      ciudadComercial: new FormControl('', [Validators.required]),
      comunaComercial: new FormControl('', [Validators.required]),
      //envioCorrespondencia: new FormControl(''),
    });

    for (const controlName in this.misDatosForm.controls) {
      this.valoresIniciales[controlName] = this.misDatosForm.get(controlName)?.value;
    }
  }

  getDatosActuales() {
    this.listasGeograficas();
    this.listasGeograficasComercial();
    this.datosUsuarioService.getDatosUsuario().subscribe(datos => {

      this.nuevoValorRegionPersonal = datos.datosUsuario.regionPersonal.label;
      this.nuevoValorCiudadPersonal = datos.datosUsuario.ciudadPersonal.label;
      this.nuevoValorComunaPersonal = datos.datosUsuario.comunaPersonal.label;
      this.nuevoValorRegionComercial = datos.datosUsuario.regionComercial.label;
      this.nuevoValorCiudadComercial = datos.datosUsuario.ciudadComercial.label;
      this.nuevoValorComunaComercial = datos.datosUsuario.comunaComercial.label;

      this.misDatosForm.setValue({
        primerNombre: datos.datosUsuario.primerNombre,
        segundoNombre: datos.datosUsuario.segundoNombre,
        apellidoPaterno: datos.datosUsuario.apellidoPaterno,
        apellidoMaterno: datos.datosUsuario.apellidoMaterno,
        rut: this.rutPipe.transform(datos.datosUsuario.rut),
        email: datos.datosUsuario.email,
        emailComercial: datos.datosUsuario.emailComercial,
        celular: this.celularPipe.transform(datos.datosUsuario.celular),
        telefono: this.telefonoFijoPipe.transform(datos.datosUsuario.telefono),
        callePersonal: datos.datosUsuario.callePersonal,
        numeroPersonal: datos.datosUsuario.numeroPersonal,
        deptoVillaBlockPersonal: datos.datosUsuario.deptoVillaBlockPersonal,
        regionPersonal: datos.datosUsuario.regionPersonal,
        ciudadPersonal: datos.datosUsuario.ciudadPersonal,
        comunaPersonal: datos.datosUsuario.comunaPersonal,
        calleComercial: datos.datosUsuario.calleComercial,
        numeroComercial: datos.datosUsuario.numeroComercial,
        oficina: datos.datosUsuario.oficina,
        regionComercial: datos.datosUsuario.regionComercial,
        ciudadComercial: datos.datosUsuario.ciudadComercial,
        comunaComercial: datos.datosUsuario.comunaComercial
      });

      // captura valor inicial de region personal
      const regionPersonal = this.listaRegiones.find(region => region.label === datos.datosUsuario.regionPersonal);
      this.regionSeleccionadaPersonalInicial = regionPersonal?.value && regionPersonal?.label;
      this.regionSeleccionadaPersonal = this.regionSeleccionadaPersonalInicial;

      // captura valor inicial de ciudad personal
      const ciudadPersonal = this.listaCiudad.find(ciudad => ciudad.label === datos.datosUsuario.ciudadPersonal);
      this.ciudadSeleccionadaPersonalInicial = ciudadPersonal?.value && ciudadPersonal?.label;
      this.ciudadSeleccionadaPersonal = this.ciudadSeleccionadaPersonalInicial;

      // captura valor inicial de comuna personal
      const comunaPersonal = this.listaComuna.find(comuna => comuna.label === datos.datosUsuario.comunaPersonal);
      this.comunaSeleccionadaPersonalInicial = comunaPersonal?.value && comunaPersonal?.label;
      this.comunaSeleccionadaPersonal = this.comunaSeleccionadaPersonalInicial;

      // captura valor inicial de region comercial
      const regionComercial = this.listaRegionesComercial.find(region => region.label === datos.datosUsuario.regionComercial);
      this.regionSeleccionadaComercialInicial = regionComercial?.value && regionComercial?.label;
      this.regionSeleccionadaComercial = this.regionSeleccionadaComercialInicial;

      // captura valor inicial de ciudad comercial
      const ciudadComercial = this.listaCiudadComercial.find(ciudad => ciudad.label === datos.datosUsuario.ciudadComercial);
      this.ciudadSeleccionadaComercialInicial = ciudadComercial?.value && ciudadComercial?.label;
      this.ciudadSeleccionadaComercial = this.ciudadSeleccionadaComercialInicial;

      // captura valor inicial de comuna comercial
      const comunaComercial = this.listaComunaComercial.find(comuna => comuna.label === datos.datosUsuario.comunaComercial);
      this.comunaSeleccionadaComercialInicial = comunaComercial?.value && comunaComercial?.label;
      this.comunaSeleccionadaComercial = this.comunaSeleccionadaComercialInicial;
    });
  }

  ngAfterViewInit(_e: Event): void {
    this.getDatosActuales();
    this.modales = Array.from(document.querySelectorAll('.modal')).map(el => {
      const modal = new bootstrap.Modal(el);
      el.addEventListener('show.bs.modal', () => {
        this.backdropService.show();  // Muestra el backdrop
      });
      el.addEventListener('hide.bs.modal', () => {
        this.backdropService.hide();  // Oculta el backdrop
      });
      return modal;
    });

    
  }
  
  detectarCambios(): void {
    this.misDatosForm.valueChanges.subscribe(() => {
      this.botonGuardarDisabled = true;
      console.log('Cambios detectados');
    });
  }

  activarSeleccionRegionPersonal(): void {
    this.misDatosForm.get('regionPersonal')?.valueChanges.subscribe(value => {
      this.regionSeleccionadaPersonal = this.listaRegiones.find(regionPersonal => regionPersonal.value === value)?.label;
    });
  }

  activarSeleccionCiudadPersonal(): void {
    this.misDatosForm.get('ciudadPersonal')?.valueChanges.subscribe(value => {
      this.ciudadSeleccionadaPersonal = this.listaCiudad.find(ciudadPersonal => ciudadPersonal.value === value)?.label;
    });
  }

  activarSeleccionComunaPersonal(): void {
    this.misDatosForm.get('comunaPersonal')?.valueChanges.subscribe(value => {
      this.comunaSeleccionadaPersonal = this.listaComuna.find(comunaPersonal => comunaPersonal.value === value)?.label;
    });
  }

  activarSeleccionRegionComercial(): void {
    this.misDatosForm.get('regionComercial')?.valueChanges.subscribe(value => {
      this.regionSeleccionadaComercial = this.listaRegionesComercial.find(regionComercial => regionComercial.value === value)?.label;
    });
  }

  activarSeleccionCiudadComercial(): void {
    this.misDatosForm.get('ciudadComercial')?.valueChanges.subscribe(value => {
      this.ciudadSeleccionadaComercial = this.listaCiudadComercial.find(ciudadComercial => ciudadComercial.value === value)?.label;
    });
  }

  activarSeleccionComunaComercial(): void {
    this.misDatosForm.get('comunaComercial')?.valueChanges.subscribe(value => {
      this.comunaSeleccionadaComercial = this.listaComunaComercial.find(comunaComercial => comunaComercial.value === value)?.label;
    });
  }

  // Boton editar datos
  editarDatos() {
    this.botonEditar = true;
    this.misDatosForm.enable();
    this.misDatosForm.get('rut')?.disable();
    this.mensajeInformativo = true;
    this.separadorBotonGuardar = true;
    this.botonGuardar = true;
    this.customSelectDisabled = false;
    this.activarSeleccionRegionPersonal();
    this.activarSeleccionCiudadPersonal();
    this.activarSeleccionComunaPersonal();
    this.activarSeleccionRegionComercial();
    this.activarSeleccionCiudadComercial();
    this.activarSeleccionComunaComercial();
    this.observarCambiosRegionPersonal();
    this.observarCambiosCiudadPersonal();
    this.observarCambiosComunaPersonal();
    this.observarCambiosRegionComercial();
    this.observarCambiosCiudadComercial();
    this.observarCambiosComunaComercial();
    this.detectarCambios();
  }

  cancelarEdicion(): void {
    location.reload();
    this.ocultaBackDrop();
  }

  // Vuelve el formulario a su estado inicial
  datosGuardados() {
    location.reload();
    this.ocultaBackDrop();
  }

  ocultaBackDrop(): void {
    this.backdropService.hide();
  }

  // Solo permite ingresar números en los campos de texto
  soloNumeros(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  // Array de regiones, ciudades y comunas
  listasGeograficas(): void {
    this.listaGeograficaService.getListaGeografica().subscribe(data => {
      this.listaRegiones = data.listaRegiones;
      this.listaCiudad = data.listaCiudad;
      this.listaComuna = data.listaComuna;

      this.listaRegiones.find(region => region.value === this.regionSeleccionadaPersonal);
      this.listaCiudad.find(ciudad => ciudad.value === this.ciudadSeleccionadaPersonal);
      this.listaComuna.find(comuna => comuna.value === this.comunaSeleccionadaPersonal);
    });
  }

  listasGeograficasComercial(): void {
    this.listaGeograficaComercialService.getListaGeograficaComercial().subscribe(data => {
      this.listaRegionesComercial = data.listaRegionesComercial;
      this.listaCiudadComercial = data.listaCiudadComercial;
      this.listaComunaComercial = data.listaComunaComercial;

      this.listaRegionesComercial.find(regionComercial => regionComercial.value === this.regionSeleccionadaComercial);
      this.listaCiudadComercial.find(ciudadComercial => ciudadComercial.value === this.ciudadSeleccionadaComercial);
      this.listaComunaComercial.find(comunaComercial => comunaComercial.value === this.comunaSeleccionadaComercial);

    });
  }

  validaInput(controlName: string): void {
    const control = this.misDatosForm.get(controlName);
  
    if (control?.value !== this.valoresIniciales[controlName]) {
      if (control?.value.trim() === '') {
        control.setErrors({ required: true });
      } else {
        control?.setErrors(null);
      }
    }
  }

  validaEmailPersonal(emailDestinatario: string) {
    const emailControl = this.misDatosForm.controls[emailDestinatario];
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
    const celularControl = this.misDatosForm.get('celular');
    if (celularControl) {
      let value = celularControl.value as string;
  
      // Si el campo está vacío, establecer inputErrorCelularVacio en true y retornar
      if (value === '') {
        this.inputErrorCelularVacio = true;
        return;
      } else {
        // Si el campo no está vacío, establecer inputErrorCelularVacio en false
        this.inputErrorCelularVacio = false;
      }

      if (celularControl?.value !== this.valoresIniciales['celular']) {
        if (celularControl?.value.trim() === '') {
          celularControl.setErrors({ required: true });
        } else {
          celularControl?.setErrors(null);
        }
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
      //celularControl.markAsTouched(); // Marcar el campo como 'touched' después de la validación
    }
  }

  validaTelefono(): void {
    const telefonoControl = this.misDatosForm.get('telefono');
    if (telefonoControl) {
      let value = telefonoControl.value as string;
  
      // Si el campo está vacío, establecer inputErrorCelularVacio en true y retornar
      if (value === '') {
        this.inputErrorTelefonoVacio = true;
        return;
      } else {
        // Si el campo no está vacío, establecer inputErrorCelularVacio en false
        this.inputErrorTelefonoVacio = false;
      }

      if (telefonoControl?.value !== this.valoresIniciales['telefono']) {
        if (telefonoControl?.value.trim() === '') {
          telefonoControl.setErrors({ required: true });
        } else {
          telefonoControl?.setErrors(null);
        }
      }
  
      // Verificar la longitud del valor
      if (value.length < 9) {
        this.inputErrorTelefonoInvalido = true;
        this.inputTelefonoValido = false;
      } else {
        this.inputErrorTelefonoInvalido = false;
        this.inputTelefonoValido = true;
        // Aplicar el pipe solo cuando el campo es válido y tiene los 9 caracteres necesarios
        value = this.telefonoFijoPipe.transform(value);
        telefonoControl.setValue(value);
      }
  
      // Cambiar la cantidad de caracteres del input de 9 a 11 después de aplicar el pipe
      if (this.inputTelefonoValido) {
        telefonoControl.setValidators([Validators.minLength(11), Validators.maxLength(11)]);
      } else {
        telefonoControl.setValidators([Validators.minLength(9), Validators.maxLength(9)]);
      }
  
      telefonoControl.updateValueAndValidity();
      //telefonoControl.markAsTouched(); // Marcar el campo como 'touched' después de la validación
    }
  }

  observarCambiosRegionPersonal(): void {
    const control = this.misDatosForm.get('regionPersonal');
    control?.valueChanges.subscribe(value => {
      const regionPersonal = this.listaRegiones.find(region => region.value === value);
      this.nuevoValorRegionPersonal = regionPersonal ? regionPersonal.label : toString();
      if (this.nuevoValorRegionPersonal !== this.regionSeleccionadaPersonalInicial) {
        this.validaRegionPersonal();
      }
    });
  }

  observarCambiosCiudadPersonal(): void {
    const control = this.misDatosForm.get('ciudadPersonal');
    control?.valueChanges.subscribe(value => {
      const ciudadPersonal = this.listaCiudad.find(ciudad => ciudad.value === value);
      this.nuevoValorCiudadPersonal = ciudadPersonal ? ciudadPersonal.label : toString();
      this.validaCiudadPersonal();
    });
  }

  observarCambiosComunaPersonal(): void {
    const control = this.misDatosForm.get('comunaPersonal');
    control?.valueChanges.subscribe(value => {
      const comunaPersonal = this.listaComuna.find(comuna => comuna.value === value);
      this.nuevoValorComunaPersonal = comunaPersonal ? comunaPersonal.label : toString();
      this.validaComunaPersonal();
    });
  }

  observarCambiosRegionComercial(): void {
    const control = this.misDatosForm.get('regionComercial');
    control?.valueChanges.subscribe(value => {
      const regionComercial = this.listaRegionesComercial.find(region => region.value === value);
      this.nuevoValorRegionComercial = regionComercial ? regionComercial.label : toString();
      this.validaRegionComercial();
    });
  }

  observarCambiosCiudadComercial(): void {
    const control = this.misDatosForm.get('ciudadComercial');
    control?.valueChanges.subscribe(value => {
      const ciudadComercial = this.listaCiudadComercial.find(ciudad => ciudad.value === value);
      this.nuevoValorCiudadComercial = ciudadComercial ? ciudadComercial.label : toString();
      this.validaCiudadComercial();
    });
  }

  observarCambiosComunaComercial(): void {
    const control = this.misDatosForm.get('comunaComercial');
    control?.valueChanges.subscribe(value => {
      const comunaComercial = this.listaComunaComercial.find(comuna => comuna.value === value);
      this.nuevoValorComunaComercial = comunaComercial ? comunaComercial.label : toString();
      this.validaComunaComercial();
    });
  }
  
  // Valida region personal
  validaRegionPersonal(): void {
    if (this.nuevoValorRegionPersonal === this.regionSeleccionadaPersonalInicial) {
      this.customRegionPersonalValido = null;
      this.customRegionPersonalInvalido = null;
      this.customRegionPersonalInvalidoMensaje = null;
      return;
    }
    if (this.nuevoValorRegionPersonal === '-') {
      this.customRegionPersonalValido = false;
      this.customRegionPersonalInvalido = true;
      this.customRegionPersonalInvalidoMensaje = true;
    } else {
      this.customRegionPersonalValido = true;
      this.customRegionPersonalInvalido = false;
      this.customRegionPersonalInvalidoMensaje = false;
    }
  }

  // Valida ciudad personal
  validaCiudadPersonal(): void {
    if (this.nuevoValorCiudadPersonal === this.ciudadSeleccionadaPersonalInicial) {
      this.customCiudadPersonalValido = null;
      this.customCiudadPersonalInvalido = null;
      this.customCiudadPersonalInvalidoMensaje = null;
      return;
    }
    if (this.nuevoValorCiudadPersonal === '-') {
      this.customCiudadPersonalValido = null;
      this.customCiudadPersonalInvalido = null;
      this.customCiudadPersonalInvalidoMensaje = null;
    } else {
      this.customCiudadPersonalValido = true;
      this.customCiudadPersonalInvalido = false;
      this.customCiudadPersonalInvalidoMensaje = false;
    }
  }

  // Valida comuna personal
  validaComunaPersonal(): void {
    if (this.nuevoValorComunaPersonal === this.comunaSeleccionadaPersonalInicial) {
      this.customComunaPersonalValido = null;
      this.customComunaPersonalInvalido = null;
      this.customComunaPersonalInvalidoMensaje = null;
      return;
    }
    if (this.nuevoValorComunaPersonal === '-') {
      this.customComunaPersonalValido = false;
      this.customComunaPersonalInvalido = true;
      this.customComunaPersonalInvalidoMensaje = true;
    } else {
      this.customComunaPersonalValido = true;
      this.customComunaPersonalInvalido = false;
      this.customComunaPersonalInvalidoMensaje = false;
    }
  }

  // Valida region comercial
  validaRegionComercial(): void {
    if (this.nuevoValorRegionComercial === this.regionSeleccionadaComercialInicial) {
      this.customRegionComercialValido = null;
      this.customRegionComercialInvalido = null;
      this.customRegionComercialInvalidoMensaje = null;
      return;
    }
    if (this.nuevoValorRegionComercial === '-') {
      this.customRegionComercialValido = false;
      this.customRegionComercialInvalido = true;
      this.customRegionComercialInvalidoMensaje = true;
    } else {
      this.customRegionComercialValido = true;
      this.customRegionComercialInvalido = false;
      this.customRegionComercialInvalidoMensaje = false;
    }
  }

  // Valida ciudad comercial
  validaCiudadComercial(): void {
    if (this.nuevoValorCiudadComercial === this.ciudadSeleccionadaComercialInicial) {
      this.customCiudadComercialValido = null;
      this.customCiudadComercialInvalido = null;
      this.customCiudadComercialInvalidoMensaje = null;
      return;
    }
    if (this.nuevoValorCiudadComercial === '-') {
      this.customCiudadComercialValido = false;
      this.customCiudadComercialInvalido = true;
      this.customCiudadComercialInvalidoMensaje = true;
    } else {
      this.customCiudadComercialValido = true;
      this.customCiudadComercialInvalido = false;
      this.customCiudadComercialInvalidoMensaje = false;
    }
  }

  // Valida comuna comercial
  validaComunaComercial(): void {
    if (this.nuevoValorComunaComercial === this.comunaSeleccionadaComercialInicial) {
      this.customComunaComercialValido = null;
      this.customComunaComercialInvalido = null;
      this.customComunaComercialInvalidoMensaje = null;
      return;
    }
    if (this.nuevoValorComunaComercial === '-') {
      this.customComunaComercialValido = false;
      this.customComunaComercialInvalido = true;
      this.customComunaComercialInvalidoMensaje = true;
    } else {
      this.customComunaComercialValido = true;
      this.customComunaComercialInvalido = false;
      this.customComunaComercialInvalidoMensaje = false;
    }
  }

  guardarDatosUsuario(): Observable<any> {

    this.backdropService.show();
    this.submitted = true;
  
    // Verifica que misDatosForm y datosUsuario estén definidos
    if (!this.misDatosForm) {
      console.log('El formulario no está definido');
      return of(null);
    }
  
    // Si el formulario es inválido, retorna un Observable que emite null
    if (this.misDatosForm.invalid) {
      console.log('El formulario es inválido');
      return of(null);
    }
  
    if (this.misDatosForm.valid) {
      const formValues = this.misDatosForm.value;
  
      const datosUsuarioEditado = {
        primerNombre: formValues.primerNombre,
        segundoNombre: formValues.segundoNombre,
        apellidoPaterno: formValues.apellidoPaterno,
        apellidoMaterno: formValues.apellidoMaterno,
        email: formValues.email,
        emailComercial: formValues.emailComercial,
        celular: formValues.celular.replace(/\s/g, ''),
        telefono: formValues.telefono.replace(/\s/g, ''),
        callePersonal: formValues.callePersonal,
        numeroPersonal: formValues.numeroPersonal,
        deptoVillaBlockPersonal: formValues.deptoVillaBlockPersonal,
        regionPersonal: formValues.regionPersonal = this.nuevoValorRegionPersonal,
        ciudadPersonal: formValues.ciudadPersonal = this.nuevoValorCiudadPersonal,
        comunaPersonal: formValues.comunaPersonal = this.nuevoValorComunaPersonal,
        calleComercial: formValues.calleComercial,
        numeroComercial: formValues.numeroComercial,
        oficina: formValues.oficina,
        regionComercial: formValues.regionComercial = this.nuevoValorRegionComercial,
        ciudadComercial: formValues.ciudadComercial = this.nuevoValorCiudadComercial,
        comunaComercial: formValues.comunaComercial = this.nuevoValorComunaComercial,
      };
  
      if (!datosUsuarioEditado) {
        console.log('datosUsuarioEditado no está definido');
        return of(null);
      }
  
      // Envía los datos al servicio
      this.datosUsuarioService.guardarDestinatarioEditado(datosUsuarioEditado).subscribe(
        (response: any) => {
          console.log('Datos guardados en el servidor:', response);
          this.actualizarDatosUsuario = false;
          this.datosGuardadosUsuarioEditado = true;
        },
        (error: any) => {
          console.error('Error al guardar los datos en el servidor:', error);
          this.actualizarDatosUsuario = false;
          this.errorServerAlGuardarDatos = true;
        }
      );
    }
  
    return of(null);
  }
  
}

