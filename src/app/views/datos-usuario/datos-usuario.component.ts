import { Component } from '@angular/core';
import { DatosUsuarioService } from '../../core/services/datos-usuario.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// Model
import { RegionesCiudadComuna } from '../../shared/models/regiones-ciudad-comuna.model';

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

  regionSeleccionada: any | undefined;
  ciudadSeleccionada: any | undefined;
  comunaSeleccionada: any | undefined;
  regionSeleccionadaComercial: any | undefined;
  ciudadSeleccionadaComercial: any | undefined;
  comunaSeleccionadaComercial: any | undefined;

  regionInvalida: any;
  ciudadInvalida: any;
  comunaInvalida: any;

  misDatosForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  //datosUsuario: any;
  primerNombre: string | undefined;
  segundoNombre: string | undefined;
  apellidoPaterno: string | undefined;
  apellidoMaterno: string | undefined;
  rut: string | undefined;
  fechaNacimiento: string | undefined;
  email: string | undefined;
  emailComercial: string | undefined;
  celular: string | undefined;
  telefono: string | undefined;
  callePersonal: string | undefined;
  numeroPersonal: string | undefined;
  deptoVillaBlockPersonal: string | undefined;
  regionPersonal: string | undefined;
  ciudadPersonal: string | undefined;
  comunaPersonal: string | undefined;
  calleComercial: string | undefined;
  numeroComercial: string | undefined;
  oficina: string | undefined;
  regionComercial: string | undefined;
  ciudadComercial: string | undefined;
  comunaComercial: string | undefined;

  mensajeInformativo = false;
  separadorBotonGuardar = false;
  botonGuardar = false;
  customSelectDisabled: boolean = true;

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
    private celularPipe: CelularPipe,
    private telefonoFijoPipe: TelefonoFijoPipe,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.listasGeograficas();
    this.misDatosForm = new FormGroup({
      primerNombre: new FormControl({value: '', disabled: true}, [Validators.required]),
      segundoNombre: new FormControl({value: '', disabled: true}, [Validators.required]),
      apellidoPaterno: new FormControl({value: '', disabled: true}, [Validators.required]),
      apellidoMaterno: new FormControl({value: '', disabled: true}, [Validators.required]),
      rut: new FormControl({value: '', disabled: true}),
      email: new FormControl({value: '', disabled: true}, [Validators.required]),
      emailComercial: new FormControl({value: '', disabled: true}),
      celular: new FormControl({value: '', disabled: true}, [Validators.required]),
      telefono: new FormControl({value: '', disabled: true}),
      callePersonal: new FormControl({value: '', disabled: true}, [Validators.required]),
      numeroPersonal: new FormControl({value: '', disabled: true}, [Validators.required]),
      deptoVillaBlockPersonal: new FormControl({value: '', disabled: true}, [Validators.required]),
      regionPersonal: new FormControl({value: '', disabled: true}, [Validators.required]),
      ciudadPersonal: new FormControl({value: '', disabled: true}, [Validators.required]),
      comunaPersonal: new FormControl({value: '', disabled: true}, [Validators.required]),
      calleComercial: new FormControl({value: '', disabled: true}, [Validators.required]),
      numeroComercial: new FormControl({value: '', disabled: true}, [Validators.required]),
      oficina: new FormControl({value: '', disabled: true}, [Validators.required]),
      regionComercial: new FormControl({value: '', disabled: true}),
      ciudadComercial: new FormControl({value: '', disabled: true}),
      comunaComercial: new FormControl({value: '', disabled: true}),
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
      console.log(this.listaRegiones);

      const regionPersonal = this.listaRegiones.find(region => region.value === '10');
      this.regionSeleccionada = regionPersonal ? regionPersonal.label : null;

      const ciudadPersonal = this.listaCiudad.find(ciudad => ciudad.value === '14');
      this.ciudadSeleccionada = ciudadPersonal ? ciudadPersonal.label : null;

      const comunaPersonal = this.listaComuna.find(comuna => comuna.value === '49');
      this.comunaSeleccionada = comunaPersonal ? comunaPersonal.label : null;

      const regionComercial = this.listaRegiones.find(region => region.value === '10');
      this.regionSeleccionadaComercial = regionComercial ? regionComercial.label : null;

      const ciudadComercial = this.listaCiudad.find(ciudad => ciudad.value === '14');
      this.ciudadSeleccionadaComercial = ciudadComercial ? ciudadComercial.label : null;

      const comunaComercial = this.listaComuna.find(comuna => comuna.value === '49');
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
      celularControl.markAsTouched(); // Marcar el campo como 'touched' después de la validación
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
      telefonoControl.markAsTouched(); // Marcar el campo como 'touched' después de la validación
    }
  }


}

