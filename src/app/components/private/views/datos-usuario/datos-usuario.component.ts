import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatosUsuarioService } from '../../../../services/datosUsuario.service';
import { FormatoEmailService } from '../../../../services/formatoEmail.service';
import { LocalidadesService } from '../../../../services/localidades.service';
import { CelularPipe } from '../../../../shared/pipes/celular.pipe';
import { TelefonoFijoPipe } from '../../../../shared/pipes/telefono-fijo.pipe';
import { RutPipe } from '../../../../shared/pipes/rut.pipe';
import { DatosUsuario } from '../../../../models/datos-usuario.model';
import { Localidades } from '../../../../models/localidades.model';

@Component({
  selector: 'mb-datos-usuario',
  templateUrl: './datos-usuario.component.html'
})
export class DatosUsuarioComponent implements OnInit {

  misDatosForm: FormGroup;

  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private formatoEmailService: FormatoEmailService,
    private celularPipe: CelularPipe,
    private telefonoFijoPipe: TelefonoFijoPipe,
    private rutPipe: RutPipe,
    private localidadesService: LocalidadesService
  ) { 
    this.misDatosForm = new FormGroup({
      primer_nombre: new FormControl('', [Validators.required]),
      segundo_nombre: new FormControl('', [Validators.required]),
      apellido_paterno: new FormControl('', [Validators.required]),
      apellido_materno: new FormControl('', [Validators.required]),
      rut: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      email_comercial: new FormControl('', [Validators.required]),
      celular: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required]),
      calle: new FormControl('', [Validators.required]),
      numero_calle: new FormControl('', [Validators.required]),
      depto_villa_block: new FormControl('', [Validators.required]),
      ciudad: new FormControl('', [Validators.required]),
      comuna: new FormControl('', [Validators.required]),
      region: new FormControl('', [Validators.required]),
      calle_comercial: new FormControl('', [Validators.required]),
      numero_calle_comercial: new FormControl('', [Validators.required]),
      oficina: new FormControl('', [Validators.required]),
      ciudad_comercial: new FormControl('', [Validators.required]),
      comuna_comercial: new FormControl('', [Validators.required]),
      region_comercial: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    /*this.localidadesService.getRegiones().subscribe((regiones: Localidades[]) => {
      console.log(regiones);
    });*/
    this.datosUsuarioService.getDatosUsuario().subscribe((datos: DatosUsuario[]) => {
      if (datos.length > 0) {
        const usuario = datos[0];
        usuario.rut = this.rutPipe.transform(usuario.rut);
        usuario.celular = this.celularPipe.transform(usuario.celular);
        usuario.telefono = this.telefonoFijoPipe.transform(usuario.telefono);
        this.misDatosForm.patchValue(usuario);
      }
    });
    
  }

}
