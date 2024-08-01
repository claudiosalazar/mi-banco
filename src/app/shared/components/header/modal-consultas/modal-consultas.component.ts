import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatosUsuarioService } from 'src/app/services/datosUsuario.service';
import { DatosUsuario } from 'src/app/models/datos-usuario.model';

@Component({
  selector: 'app-modal-consultas',
  templateUrl: './modal-consultas.component.html'
})
export class ModalConsultasComponent implements OnInit {

  @Output() consultaCancelada = new EventEmitter<void>();

  primer_nombre: any;
  segundo_nombre: any;
  apellido_paterno: any;
  apellido_materno: any;
  email: any
  celular: any;
  telefono: any;

  consultasForm: FormGroup = new FormGroup({});
  formularioConsultas = true;
  envioConsultaCorrecta = false;
  errorEnvioConsulta = false;

  // Variable para lista de consultas
  submitted = false;
  consultaValida: any;
  consultaValidaReset: any;
  consultaSeleccionada: any;
  nuevoValorConsulta: any;
  longitudTextoConsulta: number = 0;

  botonEnvioConsulta = false;

  constructor(
    private datosUsuarioService: DatosUsuarioService,
  ) { }

  ngOnInit(): void {
    this.datosUsuarioService.getDatosUsuario().subscribe((datos: DatosUsuario[]) => {
      if (datos.length > 0) {
        const usuario = datos[0];
        console.log('Datos del usuario:', usuario); // Verificar los datos obtenidos
        this.primer_nombre = usuario.primer_nombre;
        this.segundo_nombre = usuario.segundo_nombre;
        this.apellido_paterno = usuario.apellido_paterno;
        this.apellido_materno = usuario.apellido_materno;
        this.email = usuario.email;
        this.celular = usuario.celular;
        this.telefono = usuario.telefono;
      }
    });
    this.consultasForm = new FormGroup({
      consulta: new FormControl('0', [Validators.required]),
      textoConsulta: new FormControl('', [Validators.required]),
    });
  }

  enviaConsulta(): any {
    this.submitted = true;
    this.formularioConsultas = false;
    this.envioConsultaCorrecta = true;
    this.errorEnvioConsulta = false;
  }

  cancelarConsulta(): any {
    this.consultaCancelada.emit();
  }

  cerrarModalFormiarioConsultas(): any {
    this.consultaCancelada.emit();
  }

}
