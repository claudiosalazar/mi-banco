import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, ChangeDetectorRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormatoEmailService } from './../../../../../../../services/formatoEmail.service';
import { AgendaService } from '../../../../../../../services/agenda.service';

declare var bootstrap: any;

@Component({
  selector: 'app-transferencia-a-terceros',
  templateUrl: './transferencia-a-terceros.component.html',
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      state('*', style({
        opacity: 0.5
      })),
      transition('void <=> *', animate('0.2s'))
    ])
  ]
})
export class TransferenciaATercerosComponent implements OnInit {

  @ViewChild('modalNuevoDestinatario') modalNuevoDestinatario: ElementRef | undefined;
  @ViewChild('modalTransferencia') modalTransferencia: ElementRef | undefined;
  @ViewChild('modalCancelarTransferencia') modalCancelarTransferencia: ElementRef | undefined;
  @ViewChild('modalCambiosDestinatario') modalCambiosDestinatario: ElementRef | undefined;
  @ViewChild('crearDestinatarioCanvas') crearDestinatarioCanvas: ElementRef | undefined;
  @ViewChild('cambiaDestinatario') cambiaDestinatario: ElementRef | undefined;
  @ViewChild('inputMontoATransferir') inputMontoATransferir: ElementRef | undefined;
  @ViewChild('mensaje') mensaje: ElementRef | undefined;
  @ViewChild('paso1') paso1: ElementRef | undefined;
  @ViewChild('paso2') paso2: ElementRef | undefined;
  @ViewChild('paso3') paso3: ElementRef | undefined;
  @ViewChild('formTransferencia') formTransferencia: ElementRef | undefined;
  @ViewChild('tablaDestinatarioSeleccionado') tablaDestinatarioSeleccionado: ElementRef | undefined;
  @Output() datosOrdenados = new EventEmitter<void>();

  // Fomularios
  busquedaDestinatarios = new FormControl('');
  transferenciaATercerosForm: FormGroup = new FormGroup({});

  // Variable para animacion de icono en th
  agenda: any[] = [];
  paginatedAgenda: any[] = [];
  originalData: any[] = [];
  itemsPerPage = 5;
  currentPage = 1;
  paginatedData: any[] = [];
  totalPages: any;

  // Variables para ordenar datos de tabla
  sortOrder = 1;
  sortedColumn: any;
  sortAscending: boolean = true;

  // Variable para animacion de icono en th
  public isRotatedIn: boolean = false;
  public columnaSeleccionada: string | undefined;

  // Variables proceso de transferencia
  pasosTransferencia: boolean | undefined;
  ingresarDatos = false;
  confirmarDatos = false;
  transferenciaARealizar = false;
  btnContinuar = true;
  btnConfirmar = true;
  destinatarioATransferir: any[] = [];
  destinatarioATransferirSeleccionado: any;
  destinatarioSeleccionado: { id: any, nombre?: string } | undefined;
  selectedId: any = null;
  nombreDestinatario: any;

  // Variables para botones
  continuarTransferencia = false;

  // Variables para errores
  error1: boolean = false;
  error2: boolean = false;
  montoValido: boolean = false;

  // Variables para input
  inputErrorVacioEmail: any;
  inputValidoEmail: any;

  // Variable para mensajes de modal eliminar
  usuarioEliminado = false;
  errorServer = false;
  destinatarioSeleccionadoTabla = false;
  destinatarioId: any;

  constructor(
    private formatoEmailService: FormatoEmailService,
    private cdr: ChangeDetectorRef,
    private agendaService: AgendaService
  ) { }

  ngOnInit() {
    this.loadData();
    
    this.transferenciaATercerosForm = new FormGroup({
      destinatarioATransferir: new FormControl(''),
      destinatarioSeleccionado: new FormControl(''),
      montoATransferir: new FormControl('', [Validators.required]),
      mensaje: new FormControl(''),
      emailDestinatario: new FormControl({ value: '', disabled: true }, [Validators.required]),
      montoATransferirOk: new FormControl(''),
      mensajeOk: new FormControl(''),
      emailDestinatarioOk: new FormControl(''),
    });
  }

  loadData(): void {
    this.agendaService.getAgenda().subscribe((agenda: any) => {
      this.agenda = agenda;
      this.originalData = [...this.agenda];
      this.paginarAgenda();
      this.cdr.detectChanges();
    });
  }

  seleccionarDestinatario(id: any): void {
    this.destinatarioSeleccionado = { id: id };
    //this.getDatosCuentaCorriente(0);
    this.destinatarioId = id;
    this.selectedId = id;
    this.pasosTransferencia = true;
    this.ingresarDatos = true;
    //this.mostrarPaginador = false;
    // this.tablaDestinatarios = false;
    //this.buscadorDestinatarios = false;
    this.destinatarioSeleccionadoTabla = true;
    /*if (this.tablaDestinatarioSeleccionado && this.tablaDestinatarioSeleccionado.nativeElement) {
      this.tablaDestinatarioSeleccionado.nativeElement.classList.add('paso-ok');
    }*/
  
    // Encuentra el destinatario seleccionado en la lista de destinatarios
    this.destinatarioATransferirSeleccionado = this.agenda.find(agenda => agenda.id === id);
  
    // Si no se encontró un destinatario con el ID dado, selecciona el último destinatario
    if (!this.destinatarioATransferirSeleccionado) {
      this.destinatarioATransferirSeleccionado = this.agenda[this.agenda.length - 1];
    }
  
    // Llama a getClassForDestinatario con el ID del destinatario seleccionado
    //this.getClassForDestinatario(this.destinatarioATransferirSeleccionado.id);
  
    // Imprime los datos del destinatario seleccionado en la consola
    this.destinatarioATransferirSeleccionado = this.agenda.find(agenda => agenda.id === id);

    // Asigna el nombre del destinatario seleccionado a nombreDestinatario
    this.nombreDestinatario = this.destinatarioATransferirSeleccionado.nombre;

    // Actualiza los campos del formulario
    this.transferenciaATercerosForm.patchValue({
      montoATransferir: 'Ingresa el monto a transferir', // Vacía el campo 'montoATransferir'
      mensaje: '', // Vacía el campo 'mensaje'
      emailDestinatario: this.destinatarioATransferirSeleccionado.email, // Carga el email del destinatario
    });
  }

  vaciarMontoATransferir(): void {
    this.transferenciaATercerosForm.patchValue({
      montoATransferir: '', // Vacía el campo 'montoATransferir'
    });
    this.error1 = false;
    this.error2 = false;
    this.montoValido = false;
  }

  validaEmail(emailDestinatario: string) {
    const emailControl = this.transferenciaATercerosForm.controls[emailDestinatario];
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
  
    if (this.inputValidoEmail) {
      this.inputValidoEmail = true;
      this.validaDatosTransferencia(); // Solo llama a validaDatosTransferencia si inputValidoEmail es true
    } else {
      this.inputValidoEmail = false;
      this.continuarTransferencia = false; // Establece continuarTransferencia en false si inputValidoEmail es false
    }
  }

  validaDatosTransferencia() {
    const controlMontoATransferir = this.transferenciaATercerosForm.get('montoATransferir');
    const controlEmailDestinatario = this.transferenciaATercerosForm.get('emailDestinatario');
  
    if (!controlMontoATransferir || !controlEmailDestinatario) {
      this.continuarTransferencia = false; // Deshabilita el botón si los controles no existen
      return;
    }
  
    const montoATransferir = Number(controlMontoATransferir.value);
    const emailDestinatario = controlEmailDestinatario.value;
  
    // Habilita el botón si montoATransferir es válido y emailDestinatario no está vacío
    if (this.montoValido && emailDestinatario !== '') {
      this.continuarTransferencia = true; 
    } else {
      this.continuarTransferencia = false; // Deshabilita el botón en caso contrario
    }
  }

  vaciarEmailDestinatario() {
    let control = this.transferenciaATercerosForm.controls['emailDestinatario'];
    control.enable(); // Habilita el control
    control.setValue(''); // Establece el valor del control en vacío
    this.inputValidoEmail = false; // Establece inputValidoEmail en false
    this.validaEmail('emailDestinatario'); // Valida el email después de vaciarlo
    this.validaDatosTransferencia(); // Verifica las condiciones después de vaciar el email
  }

  // Function para tabla
  public onHeaderClick(): void {
    this.isRotatedIn = !this.isRotatedIn;
  }

  ordenarDatos(column: string): void {
    this.columnaSeleccionada = column;
    if (this.sortedColumn === column) {
      this.sortOrder = this.sortOrder === 1 ? -1 : 1;
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortedColumn = column;
      this.sortAscending = true;
    }
  
    this.sortOrder = this.sortAscending ? 1 : -1;
  
    this.agenda?.sort((a: { [x: string]: number; }, b: { [x: string]: number; }) => {
      return a[column] > b[column] ? this.sortOrder : a[column] < b[column] ? -this.sortOrder : 0;
    });
    this.paginarAgenda();
    this.datosOrdenados.emit();
    this.cdr.detectChanges();
  }

  // Paginación de transacciones
  paginarAgenda(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedAgenda = this.agenda.slice(start, end);
    this.totalPages = Math.ceil(this.agenda.length / this.itemsPerPage);
    this.cdr.detectChanges();
  }

  // Cambiar página
  cambiarPagina(pagina: number): void {
    this.currentPage = pagina;
    this.paginarAgenda();
    this.cdr.detectChanges();
  }
}


