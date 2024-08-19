import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatosUsuarioService } from 'src/app/services/datosUsuario.service';
import { DatosUsuario } from 'src/app/models/datos-usuario.model';

@Component({
  selector: 'mb-modal-consultas',
  templateUrl: './modal-consultas.component.html'
})
export class ModalConsultasComponent implements OnInit {

  @Output() consultaCancelada = new EventEmitter<void>();

  listaConsultas = [
    { value: '0', label: '-' },
    { value: '1', label: 'Cuenta Corriente'},
    { value: '2', label: 'Línea de Crédito'},
    { value: '3', label: 'Tarjeta de Crédito'},
    { value: '4', label: 'Crédito de Consumo'},
    { value: '5', label: 'Transferencia de Fondos'},
    { value: '6', label: 'Seguros' },
    { value: '7', label: 'Otros productos o servicios'},
    { value: '8', label: 'Reclamo'}
  ];

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
  textoConsulta: any;

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

    this.validaConsulta();
    this.validaListaConsulta();
    this.validaFormulario();
  }

  validaListaConsulta(): any {
    this.consultasForm.get('consulta')?.valueChanges.subscribe(value => {
      if (value !== 0) {
        // Se seleccionó un valor distinto a 0, el control de formulario es válido
        this.consultasForm.get('consulta')?.setErrors(null);
        this.consultaValida = true;
      }
    });
  }

  // Valida que se ingresaron mas de 50 caracteres
  validaConsulta(): any {
    this.consultasForm.get('textoConsulta')?.valueChanges.subscribe(value => {
      this.longitudTextoConsulta = value.length;
  
      if (this.longitudTextoConsulta >= 50) {
        this.consultasForm.get('textoConsulta')?.setErrors(null);
      } else {
        this.consultasForm.get('textoConsulta')?.setErrors({ 'minlength': true });
      }
    });
  }
    
  // Valida region personal
  validaFormulario(): any {
    // Suscríbete a los cambios de estado de 'consulta'
    this.consultasForm.get('consulta')?.statusChanges.subscribe(status => {
      // Comprueba si ambos controles de formulario son válidos
      if (this.consultasForm.get('consulta')?.valid && this.consultasForm.get('textoConsulta')?.valid) {
        // Ambos controles de formulario son válidos, establece 'botonEnvioConsulta' en true
        this.botonEnvioConsulta = true;
      } else {
        // Al menos uno de los controles de formulario es inválido, establece 'botonEnvioConsulta' en false
        this.botonEnvioConsulta = false;
      }
    });
  
    // Suscríbete a los cambios de estado de 'textoConsulta'
    this.consultasForm.get('textoConsulta')?.statusChanges.subscribe(status => {
      // Comprueba si ambos controles de formulario son válidos
      if (this.consultasForm.get('consulta')?.valid && this.consultasForm.get('textoConsulta')?.valid) {
        // Ambos controles de formulario son válidos, establece 'botonEnvioConsulta' en true
        this.botonEnvioConsulta = true;
      } else {
        // Al menos uno de los controles de formulario es inválido, establece 'botonEnvioConsulta' en false
        this.botonEnvioConsulta = false;
      }
    });
  }

  activarSeleccionConsultas(): any {
    this.consultasForm.get('consulta')?.valueChanges.subscribe(value => {
      const consultaSeleccionada = this.listaConsultas.find(consulta => consulta.value === value);
      this.consultaSeleccionada = consultaSeleccionada?.label;
  
      // Agrega un mensaje de consola para mostrar el valor seleccionado
      console.log('Valor seleccionado:', value);

      if (value === 0) {
        // Si el valor de 'consulta' es 0, establece 'consultaValida' en false
        this.consultasForm.get('consulta')?.setErrors(null);
        this.consultaValidaReset = true;
      }
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

  cerrarModalFormularioConsultas(): any {
    this.consultaCancelada.emit();
  }

}
