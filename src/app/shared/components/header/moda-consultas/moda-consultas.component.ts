import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DatosUsuarioService } from '../../../../core/services/datos-usuario.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-moda-consultas',
  templateUrl: './moda-consultas.component.html'
})
export class ModaConsultasComponent implements OnInit {

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

  consulta:any [] = [];

  primerNombre:any;
  segundoNombre:any;
  apellidoPaterno:any;
  apellidoMaterno:any;
  email:any;
  celular:any;
  telefono:any;
  currentUrl:any;

  // Variable para div modal consultas
  formularioConsultas = true;
  envioConsultaCorrecta = false;
  errorEnvioConsulta = false;

  consultasForm: FormGroup = new FormGroup({});

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
    this.observarCambiosConsulta();
    this.observarCambiosConsulta();
    this.datosUsuarioService.getDatosUsuario().subscribe(datos => {
      this.primerNombre = datos.datosUsuario.primerNombre;
      this.segundoNombre = datos.datosUsuario.segundoNombre;
      this.apellidoPaterno = datos.datosUsuario.apellidoPaterno;
      this.apellidoMaterno = datos.datosUsuario.apellidoMaterno;
      this.email = datos.datosUsuario.email;
      this.celular = datos.datosUsuario.celular;
      this.telefono = datos.datosUsuario.telefono;
    });

    this.consultasForm = new FormGroup({
      consulta: new FormControl('0', [Validators.required]),
      textoConsulta: new FormControl('', [Validators.required]),
    });

    this.validaConsulta();
    this.validaListaConsulta();
    this.validaFormulario();
  }

  // Logicas para formulario de consultas
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

  observarCambiosConsulta(): void {
    const control = this.consultasForm.get('consulta');
    control?.valueChanges.subscribe(value => {
      const consulta = this.listaConsultas.find(consulta => consulta.value === value);
      if (consulta) {
        this.nuevoValorConsulta = consulta.label;
      }
    });
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
