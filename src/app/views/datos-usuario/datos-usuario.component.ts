import { Component } from '@angular/core';
import { DatosUsuarioService } from '../../core/services/datos-usuario.service';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

// Model
import { RegionesCiudadComuna, RegionesCiudadComunaComercial } from '../../shared/models/regiones-ciudad-comuna.model';

// Pipe
import { RutPipe } from '../../shared/pipes/rut.pipe';
import { CelularPipe } from '../../shared/pipes/celular.pipe';
import { TelefonoFijoPipe } from '../../shared/pipes/telefono-fijo.pipe';
import { HttpClient } from '@angular/common/http';
import { skip } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

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

  regionSeleccionadaPersonal: any | undefined;
  ciudadSeleccionadaPersonal: any | undefined;
  comunaSeleccionadaPersonal: any | undefined;

  regionSeleccionadaComercial: any | undefined;
  ciudadSeleccionadaComercial: any | undefined;
  comunaSeleccionadaComercial: any | undefined;

  regionPersonalInvalida = false;
  ciudadPersonalInvalida = false;
  comunaPersonalInvalida = false;

  regionComercialInvalida = false;
  ciudadComercialInvalida = false;
  comunaComercialInvalida = false;
  

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

  formChanged = false;

  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private rutPipe: RutPipe,
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
      regionPersonal: new FormControl('', [Validators.required, this.validaRegionPersonal()]),
      ciudadPersonal: new FormControl('', [Validators.required, this.validaCiudadPersonal()]),
      comunaPersonal: new FormControl('', [Validators.required, this.validaComunaPersonal()]),
      calleComercial: new FormControl({value: '', disabled: true}, [Validators.required]),
      numeroComercial: new FormControl({value: '', disabled: true}, [Validators.required]),
      oficina: new FormControl({value: '', disabled: true}, [Validators.required]),
      regionComercial: new FormControl('', [Validators.required, this.validaRegionComercial()]),
      ciudadComercial: new FormControl('', [Validators.required, this.validaCiudadComercial()]),
      comunaComercial: new FormControl('', [Validators.required, this.validaComunaComercial()]),
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

  activarSeleccionRegionPersonal(): void {
    this.misDatosForm.get('regionPersonal')?.valueChanges.subscribe(value => {
      // Aquí puedes manejar el nuevo valor seleccionado
      console.log('Nuevo valor seleccionado:', value);
      this.regionSeleccionadaPersonal = this.listaRegiones.find(regionPersonal => regionPersonal.value === value)?.label;
    });
  }

  activarSeleccionCiudadPersonal(): void {
    this.misDatosForm.get('ciudadPersonal')?.valueChanges.subscribe(value => {
      // Aquí puedes manejar el nuevo valor seleccionado
      console.log('Nuevo valor seleccionado:', value);
      this.ciudadSeleccionadaPersonal = this.listaCiudad.find(ciudadPersonal => ciudadPersonal.value === value)?.label;
    });
  }

  activarSeleccionComunaPersonal(): void {
    this.misDatosForm.get('comunaPersonal')?.valueChanges.subscribe(value => {
      // Aquí puedes manejar el nuevo valor seleccionado
      console.log('Nuevo valor seleccionado:', value);
      this.comunaSeleccionadaPersonal = this.listaComuna.find(comunaPersonal => comunaPersonal.value === value)?.label;
    });
  }

  activarSeleccionRegionComercial(): void {
    this.misDatosForm.get('regionComercial')?.valueChanges.subscribe(value => {
      // Aquí puedes manejar el nuevo valor seleccionado
      console.log('Nuevo valor seleccionado:', value);
      this.regionSeleccionadaComercial = this.listaRegionesComercial.find(regionComercial => regionComercial.value === value)?.label;
    });
  }

  activarSeleccionCiudadComercial(): void {
    this.misDatosForm.get('ciudadComercial')?.valueChanges.subscribe(value => {
      // Aquí puedes manejar el nuevo valor seleccionado
      console.log('Nuevo valor seleccionado:', value);
      this.ciudadSeleccionadaComercial = this.listaCiudadComercial.find(ciudadComercial => ciudadComercial.value === value)?.label;
    });
  }

  activarSeleccionComunaComercial(): void {
    this.misDatosForm.get('comunaComercial')?.valueChanges.subscribe(value => {
      // Aquí puedes manejar el nuevo valor seleccionado
      console.log('Nuevo valor seleccionado:', value);
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
      //console.log(this.listaRegionesComercial);

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

  validaRegionPersonal(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const isInvalid = control.value === '0';
      return isInvalid ? { 'regionPersonalInvalida': { value: control.value } } : null;
    };
  }

  validaCiudadPersonal(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const isInvalid = control.value === '00';
      return isInvalid ? { 'ciudadPersonalInvalida': { value: control.value } } : null;
    };
  }

  validaComunaPersonal(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const isInvalid = control.value === '000';
      return isInvalid ? { 'comunaPersonalInvalida': { value: control.value } } : null;
    };
  }

  validaRegionComercial(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const isInvalid = control.value === '0000';
      return isInvalid ? { 'regionComercialInvalida': { value: control.value } } : null;
    };
  }

  validaCiudadComercial(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const isInvalid = control.value === '00000';
      return isInvalid ? { 'ciudadComercialInvalida': { value: control.value } } : null;
    };
  }

  validaComunaComercial(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const isInvalid = control.value === '000000';
      return isInvalid ? { 'comunaComercialInvalida': { value: control.value } } : null;
    };
  }


  validaEnvioDatos(): any {
    this.submitted = true;
    // ValidA custom-select banco
    const regionPersonalControl = this.misDatosForm.get('regionPersonal');
    const ciudadPersonalControl = this.misDatosForm.get('ciudadPersonal');
    const comunaPersonalControl = this.misDatosForm.get('comunaPersonal');
    const regionComercialControl = this.misDatosForm.get('regionComercial');
    const ciudadComercialControl = this.misDatosForm.get('ciudadComercial');
    const comunaComercialControl = this.misDatosForm.get('comunaComercial');

    if (regionPersonalControl && regionPersonalControl.value === '0') {
      this.regionPersonalInvalida = true;
      console.log('Region invalida');
      return of(null);
    }
    if (ciudadPersonalControl && ciudadPersonalControl.value === '00') {
      this.ciudadPersonalInvalida = true;
      return;
    }
    if (comunaPersonalControl && comunaPersonalControl.value === '000') {
      this.comunaPersonalInvalida = true;
      return;
    }
    if (regionComercialControl && regionComercialControl.value === '0000') {
      this.regionComercialInvalida = true;
      return;
    }
    if (ciudadComercialControl && ciudadComercialControl.value === '00000') {
      this.ciudadComercialInvalida = true;
      return;
    }
    if (comunaComercialControl && comunaComercialControl.value === '000000') {
      this.comunaComercialInvalida = true;
      return;
    }
    
  }

}

