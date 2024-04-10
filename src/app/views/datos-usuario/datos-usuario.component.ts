import { Component } from '@angular/core';
import { DatosUsuarioService } from '../../core/services/datos-usuario.service';
import { DatosUsuarioActual } from '../../shared/models/datos-usuario.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-datos-usuario',
  templateUrl: './datos-usuario.component.html'
})
export class DatosUsuarioComponent {

  misDatosForm: FormGroup = new FormGroup({});
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

  separadorBotonGuardar = false;
  botonGuardar = false;

  constructor(
    private datosUsuarioService: DatosUsuarioService
  ) { }

  ngOnInit() {
    this.misDatosForm = new FormGroup({
      primerNombre: new FormControl('', [Validators.required]),
      segundoNombre: new FormControl('', [Validators.required]),
      apellidoPaterno: new FormControl('', [Validators.required]),
      apellidoMaterno: new FormControl('', [Validators.required]),
      rut: new FormControl('', [Validators.required]),
      fechaNacimiento: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      emailComercial: new FormControl(''),
      celular: new FormControl('', [Validators.required]),
      telefono: new FormControl(''),
      callePersonal: new FormControl('', [Validators.required]),
      numeroPersonal: new FormControl('', [Validators.required]),
      deptoVillaBlockPersonal: new FormControl('', [Validators.required]),
      regionPersonal: new FormControl('', [Validators.required]),
      ciudadPersonal: new FormControl('', [Validators.required]),
      comunaPersonal: new FormControl('', [Validators.required]),
      calleComercial: new FormControl(''),
      numeroComercial: new FormControl(''),
      oficina: new FormControl(''),
      regionComercial: new FormControl(''),
      ciudadComercial: new FormControl(''),
      comunaComercial: new FormControl(''),
      //envioCorrespondencia: new FormControl(''),
    });

    this.datosUsuarioService.getDatosUsuario().subscribe(datos => {
      console.log('Datos del usuario recibidos:', datos);
      this.misDatosForm.setValue({
        primerNombre: datos.datosUsuario.primerNombre,
        segundoNombre: datos.datosUsuario.segundoNombre,
        apellidoPaterno: datos.datosUsuario.apellidoPaterno,
        apellidoMaterno: datos.datosUsuario.apellidoMaterno,
        rut: datos.datosUsuario.rut,
        fechaNacimiento: datos.datosUsuario.fechaNacimiento,
        email: datos.datosUsuario.email,
        emailComercial: datos.datosUsuario.emailComercial,
        celular: datos.datosUsuario.celular,
        telefono:datos.datosUsuario.telefono,
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

}
