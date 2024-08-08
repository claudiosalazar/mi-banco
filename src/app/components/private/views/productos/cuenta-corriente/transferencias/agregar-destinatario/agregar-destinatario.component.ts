import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AgendaService } from '../../../../../../../services/agenda.service';
import { Agenda } from '../../../../../../../models/agenda.model';

@Component({
  selector: 'mb-agregar-destinatario',
  templateUrl: './agregar-destinatario.component.html'
})
export class AgregarDestinatarioComponent implements OnInit {

  @Output() mostrarBackdropCustomChange = new EventEmitter<boolean>();

  agenda: any[] = [];
  datosNuevoDestinatario: any;

  // Array bancos
  listaBancos = [
    { value: '0', label: '-' },
    { value: '1', label: 'Mi Banco' },
    { value: '2', label: 'Banco de Chile' },
    { value: '3', label: 'Banco Internacional' },
    { value: '4', label: 'Scotiabank Chile' },
    { value: '5', label: 'BCI' },
    { value: '6', label: 'Corpbanca' },
    { value: '7', label: 'Banco BICE' },
    { value: '8', label: 'HSBC Bank' },
    { value: '9', label: 'Banco Santander' },
    { value: '10', label: 'Banco ITAÚ' },
    { value: '11', label: 'Banco Security' },
    { value: '12', label: 'Banco Falabella' },
    { value: '13', label: 'Deutsche Bank' },
    { value: '14', label: 'Banco Ripley' },
    { value: '15', label: 'Rabobank Chile' },
    { value: '16', label: 'Banco Consorcio' },
    { value: '17', label: 'Banco Penta' },
    { value: '18', label: 'Banco Paris' },
    { value: '19', label: 'BBVA' },
    { value: '20', label: 'Banco BTG Pactual Chile' },
    { value: '21', label: 'Banco do Brasil S.A.' },
    { value: '22', label: 'JP Morgan Cahse Bank, N. A.' },
    { value: '23', label: 'Banco de La Nación Argentina' },
    { value: '24', label: 'The Bank of Tokyo-Mitsubishi UFJ, LTD' },
    { value: '25', label: 'BCI - Miami' },
    { value: '26', label: 'Banco del Estado de Chile - Nueva York' },
    { value: '27', label: 'Corpbanca - Nueva York' },
    { value: '28', label: 'Banco del Estado de Chile' }
  ];

  // Array de tipos de cuenta
  tiposCuenta = [
    { value: '0', label: '-' },
    { value: '1', label: 'Cuenta Corriente' },
    { value: '2', label: 'Cuenta Vista' },
    { value: '3', label: 'Cuenta de Ahorro', },
    { value: '4', label: 'Cuenta Bancaria para estudiante' },
    { value: '5', label: 'Cuenta Chequera Electrónica' },
    { value: '6', label: 'Cuenta Bancaria para extranjeros' },
  ];

  crearDestinatarioForm: FormGroup = new FormGroup({});
  submitted: boolean = false;

  botonGuardarDisabled = true;

  constructor(
    private agendaService: AgendaService
   ) {}

  ngOnInit(): void {
    this.loadData();
    this.crearDestinatarioForm = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      apodoDestinatario: new FormControl(''),
      rut: new FormControl('', [Validators.required]),
      banco: new FormControl('', [Validators.required]),
      tipo_cuenta: new FormControl('', [Validators.required]),
      numero_cuenta: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      celular: new FormControl(''),
      telefono: new FormControl(''),
    });
  }

  loadData(): void {
    this.agendaService.getAgenda().subscribe((agenda: any) => {
      this.agenda = agenda;
      console.log('Agenda:', this.agenda);
    });
  }

  // Solo permite ingresar números en los campos de texto
  soloNumeros(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  // Solo permite numeros y letra K en el ultimo digito
  formatoRut(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    const value = (event.target as HTMLInputElement).value;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      if (charCode === 75 || charCode === 107) {
        return value.length === 8;
      }
      return false;
    }
    return true;
  }

  guardaNuevoDestinatario(): void {
    this.submitted = true;

    // Verifica que todos los campos del formulario estén llenos
    this.crearDestinatarioForm.markAllAsTouched();

    // Verifica que el formulario sea válido
    if (this.crearDestinatarioForm.valid) {
      const formValues = this.crearDestinatarioForm.value;

      // Elimina los puntos y el guión del RUT
      const rutSinFormato = formValues.rut.replace(/\./g, '').replace(/-/g, '');
      const datosNuevoDestinatario: Agenda = {
        id: null,
        nombre: formValues.nombre,
        apodo: formValues.apodoDestinatario,
        rut: rutSinFormato,
        banco: this.listaBancos.find(b => b.value === formValues.banco)?.label ?? '',
        tipo_cuenta: this.tiposCuenta.find(t => t.value === formValues.tipo_cuenta)?.label ?? '',
        numero_cuenta: formValues.numero_cuenta,
        email: formValues.email,
        celular: formValues.celular.replace(/\s/g, ''),
        telefono: formValues.telefono.replace(/\s/g, '')
      };

      // Obtener todos los IDs existentes y generar un nuevo ID
      this.agendaService.getAgenda().subscribe(agenda => {
        const ids = agenda.map((item: Agenda) => item.id);
        const nuevoId = Math.max(...ids) + 1;
        datosNuevoDestinatario.id = nuevoId;

        // Enviar los datos al servicio para guardarlos en la base de datos
        this.agendaService.guardarNuevoDestinatario(datosNuevoDestinatario).subscribe(response => {
          console.log('Datos enviados al servicio:', response);

          // Aquí cambias el valor de mostrarBackdropCustomChange a false
          this.mostrarBackdropCustomChange.emit(false);
        });
      });
    }
  }

  cancelar(): void {
    this.mostrarBackdropCustomChange.emit(false);
  }

}