import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatosUsuarioService } from '../../../../services/datosUsuario.service';
import { FormatoEmailService } from '../../../../services/formatoEmail.service';
import { BackdropService } from '../../../../services/backdrop.service';
import { LocalidadesService } from '../../../../services/localidades.service';
import { CelularPipe } from '../../../../shared/pipes/celular.pipe';
import { TelefonoFijoPipe } from '../../../../shared/pipes/telefono-fijo.pipe';
import { RutPipe } from '../../../../shared/pipes/rut.pipe';
import { DatosUsuario } from '../../../../models/datos-usuario.model';
import { Localidades } from '../../../../models/localidades.model';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'mb-datos-usuario',
  templateUrl: './datos-usuario.component.html'
})
export class DatosUsuarioComponent implements OnInit {

  usuarioId: number | undefined;
  misDatosForm: FormGroup;
  submitted: boolean = false;
  customSelectDisabled: boolean = true;
  botonEditar = false;
  mensajeInformativo = false;
  separadorBotonGuardar = false;
  botonGuardar = false;
  botonGuardarDisabled = false;

  listaRegiones: Localidades[] = [];
  listaComunas: Localidades[] = [];
  listaCiudades: Localidades[] = [];
  listaRegionesComerciales: Localidades[] = [];
  listaComunasComerciales: Localidades[] = [];
  listaCiudadesComerciales: Localidades[] = [];

  // regionSeleccionadaInicial: any | undefined;
  regionSeleccionada: any | undefined;
  // comunaSeleccionadaInicial: any | undefined;
  comunaSeleccionada: any | undefined;
  // ciudadSeleccionadaInicial: any | undefined;
  ciudadSeleccionada: any | undefined;

  // regionSeleccionadaComercialInicial: any | undefined;
  regionSeleccionadaComercial: any | undefined;
  // comunaSeleccionadaComercialInicial: any | undefined;
  comunaSeleccionadaComercial: any | undefined;
  // ciudadSeleccionadaComercialInicial: any | undefined;
  ciudadSeleccionadaComercial: any | undefined;

  primer_nombre: any;
  segundo_nombre: any;
  apellido_paterno: any;
  apellido_materno: any;
  rut: any;
  email: any;
  email_comercial: any;
  celular: any;
  telefono: any;
  calle: any;
  numero_calle: any;
  depto_villa_block: any;
  region: any;
  comuna: any;
  ciudad: any;
  calle_comercial: any;
  numero_calle_comercial: any;
  oficina: any;
  region_comercial: any;
  comuna_comercial: any;
  ciudad_comercial: any;
  

  // Variable para region personal
  customRegionValido: boolean | null = null;
  customRegionInvalido: boolean | null = null;
  customRegionInvalidoMensaje: boolean | null = null;

  // Variable para ciudad personal
  customCiudadValido: boolean | null = null;
  customCiudadInvalido: boolean | null = null;
  customCiudadInvalidoMensaje: boolean | null = null;

  // Variable para comuna personal
  customComunaValido: boolean | null = null;
  customComunaInvalido: boolean | null = null;
  customComunaInvalidoMensaje: boolean | null = null;

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

  nuevoValorRegion: any;
  nuevoValorCiudad: any;
  nuevoValorComuna: any;
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

  // Variables modal
  actualizarDatosUsuario = true;
  datosGuardadosUsuarioEditado = false;
  errorServerAlGuardarDatos = false;

  datosUsuarioEditado: any;

  mostrarBackdropCustomModal = false;
  modales: any[] = [];

  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private formatoEmailService: FormatoEmailService,
    private celularPipe: CelularPipe,
    private telefonoFijoPipe: TelefonoFijoPipe,
    private rutPipe: RutPipe,
    private localidadesService: LocalidadesService,
    private backdropService: BackdropService,
    private cdr: ChangeDetectorRef
  ) { 
    this.misDatosForm = new FormGroup({
      primer_nombre: new FormControl({value: '', disabled: true}, [Validators.required]),
      segundo_nombre: new FormControl({value: '', disabled: true}, [Validators.required]),
      apellido_paterno: new FormControl({value: '', disabled: true}, [Validators.required]),
      apellido_materno: new FormControl({value: '', disabled: true}, [Validators.required]),
      rut: new FormControl({value: '', disabled: true}),
      email: new FormControl({value: '', disabled: true}, [Validators.required]),
      email_comercial: new FormControl({value: '', disabled: true}, [Validators.required]),
      celular: new FormControl({value: '', disabled: true}),
      telefono: new FormControl({value: '', disabled: true}),
      calle: new FormControl({value: '', disabled: true}, [Validators.required]),
      numero_calle: new FormControl({value: '', disabled: true}, [Validators.required]),
      depto_villa_block: new FormControl({value: '', disabled: true}),
      ciudad: new FormControl({value: '', disabled: true}, [Validators.required]),
      comuna: new FormControl({value: '', disabled: true}, [Validators.required]),
      region: new FormControl({value: '', disabled: true}, [Validators.required]),
      calle_comercial: new FormControl({value: '', disabled: true}, [Validators.required]),
      numero_calle_comercial: new FormControl({value: '', disabled: true}, [Validators.required]),
      oficina: new FormControl({value: '', disabled: true}, [Validators.required]),
      ciudad_comercial: new FormControl({value: '', disabled: true}, [Validators.required]),
      comuna_comercial: new FormControl({value: '', disabled: true}, [Validators.required]),
      region_comercial: new FormControl({value: '', disabled: true}, [Validators.required]),
    });
  }

  ngOnInit() {
    // Obtener regiones
    this.localidadesService.getRegiones().subscribe({
      next: (regiones: Localidades[]) => {
        this.listaRegiones = regiones;
        this.listaRegionesComerciales = regiones;
      },
      error: (error) => {
        console.error('Error al obtener las regiones', error);
      }
    });
  
    // Obtener comunas
    this.localidadesService.getComunas().subscribe({
      next: (comunas: Localidades[]) => {
        this.listaComunas = comunas;
        this.listaComunasComerciales = comunas;
      },
      error: (error) => {
        console.error('Error al obtener las comunas', error);
      }
    });
  
    // Obtener ciudades
    this.localidadesService.getCiudades().subscribe({
      next: (ciudades: Localidades[]) => {
        this.listaCiudades = ciudades;
        this.listaCiudadesComerciales = ciudades;
      },
      error: (error) => {
        console.error('Error al obtener las ciudades', error);
      }
    });
  
    // Obtener id_user del localStorage
    const idUser = localStorage.getItem('id_user') || '';
    if (idUser) {
      const idUserNumber = Number(idUser); // Convertir a número
      this.datosUsuarioService.getDatosUsuario(idUserNumber).subscribe({
        next: (datos: DatosUsuario[]) => {
          if (datos.length > 0) {
            const usuario = datos[0];
            this.usuarioId = usuario.id_datos_usuario; // Almacenar el ID del usuario
  
            // Asegurarse de que las propiedades sean cadenas antes de aplicar las transformaciones
            usuario.rut = typeof usuario.rut === 'string' ? this.rutPipe.transform(usuario.rut) : usuario.rut;
            usuario.celular = typeof usuario.celular === 'string' ? this.celularPipe.transform(usuario.celular) : usuario.celular;
            usuario.telefono = typeof usuario.telefono === 'string' ? this.telefonoFijoPipe.transform(usuario.telefono) : usuario.telefono;
  
            this.region = usuario.region;
            this.comuna = usuario.comuna;
            this.ciudad = usuario.ciudad;
            this.region_comercial = usuario.region_comercial;
            this.comuna_comercial = usuario.comuna_comercial;
            this.ciudad_comercial = usuario.ciudad_comercial;
            this.misDatosForm.patchValue(usuario);
  
            // Guardar el valor de la región seleccionada inicialmente
            this.region = this.region;
            this.comuna = this.comuna;
            this.comuna = this.comuna;
            this.region_comercial = this.region_comercial;
            this.comuna_comercial = this.comuna_comercial;
            this.ciudad_comercial = this.ciudad_comercial;
          } else {
            console.warn('No se encontraron datos del usuario');
          }
          console.log('ID Usuario:', this.usuarioId);
        },
        error: (error) => {
          console.error('Error al obtener los datos del usuario', error);
        }
      });
    } else {
      console.error('No se encontró id_user en el localStorage');
    }
  }

  observarCambiosRegion(): void {
    this.misDatosForm.get('region')?.valueChanges.subscribe(selectedRegionId => {
      const selectedRegion = this.listaRegiones.find(region => region.id === selectedRegionId);
      if (selectedRegion) {
        this.region = selectedRegion.label;
        if (this.region !== this.region) {
          this.region = this.regionSeleccionada; // Actualizar si el valor cambia
          this.cdr.detectChanges();
        }
      }
      console.log('Región seleccionada:', this.region);
    });
  }

  observarCambiosComuna() {
    this.misDatosForm.get('comuna')?.valueChanges.subscribe(selectedComunaId => {
      const selectedComuna = this.listaComunas.find(comuna => comuna.id === selectedComunaId);
      if (selectedComuna) {
        this.comuna = selectedComuna.label;
        if (this.comuna !== this.comuna) {
          this.comuna = this.comunaSeleccionada; // Actualizar si el valor cambia
          this.cdr.detectChanges();
        }
      }
      console.log('Comuna seleccionada:', this.comuna);
    });
  }

  observarCambiosCiudad() {
    this.misDatosForm.get('ciudad')?.valueChanges.subscribe(selectedCiudadId => {
      const selectedCiudad = this.listaCiudades.find(ciudad => ciudad.id === selectedCiudadId);
      if (selectedCiudad) {
        this.ciudad = selectedCiudad.label;
        if (this.ciudad !== this.ciudad) {
          this.ciudad = this.ciudadSeleccionada; // Actualizar si el valor cambia
          this.cdr.detectChanges();
        }
      }
      console.log('Ciudad seleccionada:', this.ciudad);
    });
  }

  observarCambiosRegionComercial() {
    this.misDatosForm.get('region_comercial')?.valueChanges.subscribe(selectedRegionComercialId => {
      const selectedRegionComercial = this.listaRegionesComerciales.find(region_comercial => region_comercial.id === selectedRegionComercialId);
      if (selectedRegionComercial) {
        this.region_comercial = selectedRegionComercial.label;
        if (this.region_comercial !== this.region_comercial) {
          this.region_comercial = this.regionSeleccionadaComercial; // Actualizar si el valor cambia
          this.cdr.detectChanges();
        }
      }
      console.log('Región seleccionada:', this.region_comercial);
    });
  }

  observarCambiosComunaComercial() {
    this.misDatosForm.get('comuna_comercial')?.valueChanges.subscribe(selectedComunaComercialId => {
      const selectedComunaComercial = this.listaComunasComerciales.find(comuna_comercial => comuna_comercial.id === selectedComunaComercialId);
      if (selectedComunaComercial) {
        this.comuna_comercial = selectedComunaComercial.label;
        if (this.comuna_comercial !== this.comuna_comercial) {
          this.comuna_comercial = this.comunaSeleccionadaComercial; // Actualizar si el valor cambia
          this.cdr.detectChanges();
        }
      }
      console.log('Región seleccionada:', this.comuna_comercial);
    });
  }

  observarCambiosCiudadComercial() {
    this.misDatosForm.get('ciudad_comercial')?.valueChanges.subscribe(selectedCiudadComercialId => {
      const selectedCiudadComercial = this.listaCiudadesComerciales.find(ciudad_comercial => ciudad_comercial.id === selectedCiudadComercialId);
      if (selectedCiudadComercial) {
        this.ciudad_comercial = selectedCiudadComercial.label;
        if (this.ciudad_comercial !== this.ciudad_comercial) {
          this.ciudad_comercial = this.ciudadSeleccionadaComercial; // Actualizar si el valor cambia
          this.cdr.detectChanges();
        }
      }
      console.log('Región seleccionada:', this.ciudad_comercial);
    });
  }

  activarSeleccionRegion(): void {
    this.misDatosForm.get('region')?.valueChanges.subscribe(value => {
      const selectedRegion = this.listaRegiones.find(region => region.value === value);
      if (selectedRegion) {
        this.region = selectedRegion.label;
        this.regionSeleccionada = selectedRegion.label; // Guardar el valor seleccionado
      }
    });
  }

  activarSeleccionComuna(): void {
    this.misDatosForm.get('comuna')?.valueChanges.subscribe(value => {
      const selectedComuna = this.listaComunas.find(comuna => comuna.value === value);
      if (selectedComuna) {
        this.comuna = selectedComuna.label;
        this.comunaSeleccionada = selectedComuna.label; // Guardar el valor seleccionado
      }
    });
  }
  
  activarSeleccionCiudad(): void {
    this.misDatosForm.get('ciudad')?.valueChanges.subscribe(value => {
      const selectedCiudad = this.listaCiudades.find(ciudad => ciudad.value === value);
      if (selectedCiudad) {
        this.ciudad = selectedCiudad.label;
        this.ciudadSeleccionada = selectedCiudad.label; // Guardar el valor seleccionado
      }
    });
  }

  activarSeleccionRegionComercial(): void {
    this.misDatosForm.get('region_comercial')?.valueChanges.subscribe(value => {
      const selectedRegionComercial = this.listaRegionesComerciales.find(region_comercial => region_comercial.value === value);
      if (selectedRegionComercial) {
        this.region_comercial = selectedRegionComercial.label;
        this.regionSeleccionadaComercial = selectedRegionComercial.label; // Guardar el valor seleccionado
      }
    });
  }

  activarSeleccionComunaComercial(): void {
    this.misDatosForm.get('comuna_comercial')?.valueChanges.subscribe(value => {
      const selectedComunaComercial = this.listaComunasComerciales.find(comuna_comercial => comuna_comercial.value === value);
      if (selectedComunaComercial) {
        this.comuna_comercial = selectedComunaComercial.label;
        this.comunaSeleccionadaComercial = selectedComunaComercial.label; // Guardar el valor seleccionado
      }
    });
    console.log('Comuna seleccionada:', this.comuna_comercial);
  }

  activarSeleccionCiudadComercial(): void {
    this.misDatosForm.get('ciudad_comercial')?.valueChanges.subscribe(value => {
      const selectedCiudadComercial = this.listaCiudadesComerciales.find(ciudad_comercial => ciudad_comercial.value === value);
      if (selectedCiudadComercial) {
        this.ciudad_comercial = selectedCiudadComercial.label;
        this.ciudadSeleccionadaComercial = selectedCiudadComercial.label; // Guardar el valor seleccionado
      }
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

  // Valida region personal
  validaRegion(): void {
    if (this.nuevoValorRegion === this.region) {
      this.customRegionValido = null;
      this.customRegionInvalido = null;
      this.customRegionInvalidoMensaje = null;
      return;
    }
    if (this.nuevoValorRegion === '-') {
      this.customRegionValido = false;
      this.customRegionInvalido = true;
      this.customRegionInvalidoMensaje = true;
    } else {
      this.customRegionValido = true;
      this.customRegionInvalido = false;
      this.customRegionInvalidoMensaje = false;
    }
  }

  // Valida ciudad personal
  validaCiudad(): void {
    if (this.nuevoValorCiudad === this.ciudad) {
      this.customCiudadValido = null;
      this.customCiudadInvalido = null;
      this.customCiudadInvalidoMensaje = null;
      return;
    }
    if (this.nuevoValorCiudad === '-') {
      this.customCiudadValido = null;
      this.customCiudadInvalido = null;
      this.customCiudadInvalidoMensaje = null;
    } else {
      this.customCiudadValido = true;
      this.customCiudadInvalido = false;
      this.customCiudadInvalidoMensaje = false;
    }
  }

  // Valida comuna personal
  validaComuna(): void {
    if (this.nuevoValorComuna === this.comuna) {
      this.customComunaValido = null;
      this.customComunaInvalido = null;
      this.customComunaInvalidoMensaje = null;
      return;
    }
    if (this.nuevoValorComuna === '-') {
      this.customComunaValido = false;
      this.customComunaInvalido = true;
      this.customComunaInvalidoMensaje = true;
    } else {
      this.customComunaValido = true;
      this.customComunaInvalido = false;
      this.customComunaInvalidoMensaje = false;
    }
  }

  // Valida region comercial
  validaRegionComercial(): void {
    if (this.nuevoValorRegionComercial === this.region_comercial) {
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
    if (this.nuevoValorCiudadComercial === this.ciudad_comercial) {
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
    if (this.nuevoValorComunaComercial === this.comuna_comercial) {
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

  detectarCambios(): void {
    this.misDatosForm.valueChanges.subscribe(() => {
      this.botonGuardarDisabled = true;
    });
  }

  editarDatos() {
    this.botonEditar = true;
    this.misDatosForm.enable();
    this.misDatosForm.get('rut')?.disable();
    this.customSelectDisabled = false;
    this.mensajeInformativo = true;
    this.separadorBotonGuardar = true;
    this.botonGuardar = true;
    this.activarSeleccionRegion();
    this.activarSeleccionCiudad();
    this.activarSeleccionComuna();
    this.activarSeleccionRegionComercial();
    this.activarSeleccionCiudadComercial();
    this.activarSeleccionComunaComercial();
    this.observarCambiosRegion();
    this.observarCambiosCiudad();
    this.observarCambiosComuna();
    this.observarCambiosRegionComercial();
    this.observarCambiosCiudadComercial();
    this.observarCambiosComunaComercial();
    this.detectarCambios();
}

actualizarUsuario(id: number, datosUsuarioEditado: any) {
    this.datosUsuarioService.guardarUsuarioEditado(id, datosUsuarioEditado).subscribe(
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

guardarDatosUsuario(): Observable<any> {
  this.submitted = true;

  if (!this.misDatosForm) {
      console.log('El formulario no está definido');
      return of(null);
  }

  if (this.misDatosForm.invalid) {
      console.log('El formulario es inválido');
      // Agregar logs para depuración
      console.log('Errores del formulario:', this.misDatosForm.errors);
      Object.keys(this.misDatosForm.controls).forEach(key => {
          const controlErrors = this.misDatosForm.get(key)?.errors;
          if (controlErrors) {
              console.log(`Errores en el campo ${key}:`, controlErrors);
          }
      });
      return of(null);
  }

  if (this.misDatosForm.valid) {
      const formValues = this.misDatosForm.value;

      const initialRegionLabel = this.region;
      const initialComunaLabel = this.comuna;
      const initialCiudadLabel = this.ciudad;
      const initialRegionComercialLabel = this.region_comercial;
      const initialComunaComercialLabel = this.comuna_comercial;
      const initialCiudadComercialLabel = this.ciudad_comercial;
      const regionLabel = this.regionSeleccionada ? this.listaRegiones.find(region => region.label === this.regionSeleccionada)?.label : initialRegionLabel;
      const comunaLabel = this.comunaSeleccionada ? this.listaComunas.find(comuna => comuna.label === this.comunaSeleccionada)?.label : initialComunaLabel;
      const ciudadLabel = this.ciudadSeleccionada ? this.listaCiudades.find(ciudad => ciudad.label === this.ciudadSeleccionada)?.label : initialCiudadLabel;
      const regionComercialLabel = this.regionSeleccionadaComercial ? this.listaRegionesComerciales.find(region_comercial => region_comercial.label === this.regionSeleccionadaComercial)?.label : initialRegionComercialLabel;
      const comunaComercialLabel = this.comunaSeleccionadaComercial ? this.listaComunasComerciales.find(comuna_comercial => comuna_comercial.label === this.comunaSeleccionadaComercial)?.label : initialComunaComercialLabel;
      const ciudadComercialLabel = this.ciudadSeleccionadaComercial ? this.listaCiudadesComerciales.find(ciudad_comercial => ciudad_comercial.label === this.ciudadSeleccionadaComercial)?.label : initialCiudadComercialLabel;
      const celular = formValues.celular.replace(/\s/g, '');
      const telefono = formValues.telefono.replace(/\s/g, '');
      const celularNumber = celular ? Number(celular) : null;
      const telefonoNumber = telefono ? Number(telefono) : null;

      const datosUsuarioEditado: any = {
          id: this.usuarioId = this.usuarioId || 0,
          primer_nombre: formValues.primer_nombre,
          segundo_nombre: formValues.segundo_nombre,
          apellido_paterno: formValues.apellido_paterno,
          apellido_materno: formValues.apellido_materno,
          rut: formValues.rut,
          email: formValues.email,
          email_comercial: formValues.email_comercial,
          celular: celularNumber,
          telefono: telefonoNumber,
          calle: formValues.calle,
          numero_calle: formValues.numero_calle,
          depto_villa_block: formValues.depto_villa_block || null, // Asignar null si está vacío
          region: regionLabel,
          comuna: comunaLabel,
          ciudad: ciudadLabel,
          calle_comercial: formValues.calle_comercial,
          numero_calle_comercial: formValues.numero_calle_comercial,
          oficina: formValues.oficina,
          region_comercial: regionComercialLabel,
          comuna_comercial: comunaComercialLabel,
          ciudad_comercial: ciudadComercialLabel,
      };
      
      // Agregar logs para depuración
      console.log('Datos del usuario editado:', datosUsuarioEditado);
      
      if (!datosUsuarioEditado) {
          console.log('datosUsuarioEditado no está definido');
          return of(null);
      }
      
      // Obtener el id_user del almacenamiento
      const idUser = localStorage.getItem('id_user') || sessionStorage.getItem('id_user');
      if (idUser) {
          datosUsuarioEditado.id = parseInt(idUser, 10);
      } else {
          console.log('id_user no está definido en el almacenamiento');
          return of(null);
      }
      
      // Llamar al método actualizarUsuario
      this.actualizarUsuario(datosUsuarioEditado.id, datosUsuarioEditado);
  }
  console.table(this.datosUsuarioEditado);
  return of(null);
}

  cancelarEdicion(): void {
    location.reload();
    this.ocultaBackDrop();
  }

  soloNumeros(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  datosGuardados() {
    location.reload();
    this.ocultaBackDrop();
  }

  ocultaBackDrop(): void {
    this.backdropService.hideModalBackdrop();
  }

}