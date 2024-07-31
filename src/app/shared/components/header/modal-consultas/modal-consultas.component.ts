import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-consultas',
  templateUrl: './modal-consultas.component.html'
})
export class ModalConsultasComponent implements OnInit {

  @Output() consultaCancelada = new EventEmitter<void>();

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

  constructor() { }

  ngOnInit() {
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
