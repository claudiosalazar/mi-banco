import { Component,  } from '@angular/core';
import { DatosUsuarioService } from '../../core/services/datos-usuario.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// Services
import { FormatoEmailService } from '../../core/services/formato-email.service';

// Model
import { RegionesCiudadComuna, RegionesCiudadComunaComercial } from '../../shared/models/regiones-ciudad-comuna.model';

// Pipe
import { RutPipe } from '../../shared/pipes/rut.pipe';
import { CelularPipe } from '../../shared/pipes/celular.pipe';
import { TelefonoFijoPipe } from '../../shared/pipes/telefono-fijo.pipe';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-datos-usuario',
  templateUrl: './datos-usuario.component.html'
})
export class DatosUsuarioComponent {

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

  nuevoValorRegionPersonal: string | null = null;
  nuevoValorCiudadPersonal: string | null = null;
  nuevoValorComunaPersonal: string | null = null;
  nuevoValorRegionComercial: string | null = null;
  nuevoValorCiudadComercial: string | null = null;
  nuevoValorComunaComercial: string | null = null;

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

  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private rutPipe: RutPipe,
    private formatoEmailService: FormatoEmailService,
    private celularPipe: CelularPipe,
    private telefonoFijoPipe: TelefonoFijoPipe,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.listasGeograficas();
    this.listasGeograficasComercial();
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

    this.datosUsuarioService.getDatosUsuario().subscribe(datos => {
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
      this.regionSeleccionadaPersonalInicial = regionPersonal?.value;

      // captura valor inicial de ciudad personal
      const ciudadPersonal = this.listaCiudad.find(ciudad => ciudad.label === datos.datosUsuario.ciudadPersonal);
      this.ciudadSeleccionadaPersonalInicial = ciudadPersonal?.value;

      // captura valor inicial de comuna personal
      const comunaPersonal = this.listaComuna.find(comuna => comuna.label === datos.datosUsuario.comunaPersonal);
      this.comunaSeleccionadaPersonalInicial = comunaPersonal?.value;

      // captura valor inicial de region comercial
      const regionComercial = this.listaRegionesComercial.find(region => region.label === datos.datosUsuario.regionComercial);
      this.regionSeleccionadaComercialInicial = regionComercial?.value;

      // captura valor inicial de ciudad comercial
      const ciudadComercial = this.listaCiudadComercial.find(ciudad => ciudad.label === datos.datosUsuario.ciudadComercial);
      this.ciudadSeleccionadaComercialInicial = ciudadComercial?.value;

      // captura valor inicial de comuna comercial
      const comunaComercial = this.listaComunaComercial.find(comuna => comuna.label === datos.datosUsuario.comunaComercial);
      this.comunaSeleccionadaComercialInicial = comunaComercial?.value;
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
    this.http.get<RegionesCiudadComuna>('http://localhost:4200/assets/json/regiones-ciudad-comuna.json').subscribe(data => {
      this.listaRegiones = data.listaRegiones;
      this.listaCiudad = data.listaCiudad;
      this.listaComuna = data.listaComuna;

      // CORREGIR DATO DE RECION CIUDAD Y COMUNA, DEBEN ESTAR EN 0
      const regionPersonal = this.listaRegiones.find(region => region.value === '10');
      this.regionSeleccionadaPersonal = regionPersonal ? regionPersonal.label : null;

      const ciudadPersonal = this.listaCiudad.find(ciudad => ciudad.value === '014');
      this.ciudadSeleccionadaPersonal = ciudadPersonal ? ciudadPersonal.label : null;

      const comunaPersonal = this.listaComuna.find(comuna => comuna.value === '0049');
      this.comunaSeleccionadaPersonal = comunaPersonal ? comunaPersonal.label : null;
    });
  }

  listasGeograficasComercial(): void {
    this.http.get<RegionesCiudadComunaComercial>('http://localhost:4200/assets/json/regiones-ciudad-comuna.json').subscribe(data => {
      this.listaRegionesComercial = data.listaRegionesComercial;
      this.listaCiudadComercial = data.listaCiudadComercial;
      this.listaComunaComercial = data.listaComunaComercial;
      console.log(this.listaRegionesComercial);

      const regionComercial = this.listaRegionesComercial.find(regionComercial => regionComercial.value === '00010');
      this.regionSeleccionadaComercial = regionComercial ? regionComercial.label : null;

      const ciudadComercial = this.listaCiudadComercial.find(ciudadComercial => ciudadComercial.value === '000014');
      this.ciudadSeleccionadaComercial = ciudadComercial ? ciudadComercial.label : null;

      const comunaComercial = this.listaComunaComercial.find(comunaComercial => comunaComercial.value === '0000049');
      this.comunaSeleccionadaComercial = comunaComercial ? comunaComercial.label : null;
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
      this.nuevoValorRegionPersonal = value;
      if (this.nuevoValorRegionPersonal !== this.regionSeleccionadaPersonalInicial) {
        this.validaRegionPersonal();
      }
    });
  }

  observarCambiosCiudadPersonal(): void {
    const control = this.misDatosForm.get('ciudadPersonal');
    control?.valueChanges.subscribe(value => {
      this.nuevoValorCiudadPersonal = value;
      if (this.nuevoValorCiudadPersonal !== this.ciudadSeleccionadaPersonalInicial) {
        this.validaCiudadPersonal();
      }
    });
  }

  observarCambiosComunaPersonal(): void {
    const control = this.misDatosForm.get('comunaPersonal');
    control?.valueChanges.subscribe(value => {
      this.nuevoValorComunaPersonal = value;
      if (this.nuevoValorComunaPersonal !== this.comunaSeleccionadaPersonalInicial) {
        this.validaComunaPersonal();
      }
    });
  }

  observarCambiosRegionComercial(): void {
    const control = this.misDatosForm.get('regionComercial');
    control?.valueChanges.subscribe(value => {
      this.nuevoValorRegionComercial = value;
      if (this.nuevoValorRegionComercial !== this.regionSeleccionadaComercialInicial) {
        this.validaRegionComercial();
      }
    });
  }

  observarCambiosCiudadComercial(): void {
    const control = this.misDatosForm.get('ciudadComercial');
    control?.valueChanges.subscribe(value => {
      this.nuevoValorCiudadComercial = value;
      if (this.nuevoValorCiudadComercial !== this.ciudadSeleccionadaComercialInicial) {
        this.validaCiudadComercial();
      }
    });
  }

  observarCambiosComunaComercial(): void {
    const control = this.misDatosForm.get('comunaComercial');
    control?.valueChanges.subscribe(value => {
      this.nuevoValorComunaComercial = value;
      if (this.nuevoValorComunaComercial !== this.comunaSeleccionadaComercialInicial) {
        this.validaComunaComercial();
      }
    });
  }
  
  // Valida region personal
  validaRegionPersonal(): void {
    if (this.nuevoValorRegionPersonal === '0') {
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
    if (this.nuevoValorCiudadPersonal === '00') {
      this.customCiudadPersonalValido = false;
      this.customCiudadPersonalInvalido = true;
      this.customCiudadPersonalInvalidoMensaje = true;
    } else {
      this.customCiudadPersonalValido = true;
      this.customCiudadPersonalInvalido = false;
      this.customCiudadPersonalInvalidoMensaje = false;
    }
  }

  // Valida comuna personal
  validaComunaPersonal(): void {
    if (this.nuevoValorComunaPersonal === '000') {
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
    if (this.nuevoValorRegionComercial === '0000') {
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
    if (this.nuevoValorCiudadComercial === '00000') {
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
    if (this.nuevoValorComunaComercial === '000000') {
      this.customComunaComercialValido = false;
      this.customComunaComercialInvalido = true;
      this.customComunaComercialInvalidoMensaje = true;
    } else {
      this.customComunaComercialValido = true;
      this.customComunaComercialInvalido = false;
      this.customComunaComercialInvalidoMensaje = false;
    }
  }

}

