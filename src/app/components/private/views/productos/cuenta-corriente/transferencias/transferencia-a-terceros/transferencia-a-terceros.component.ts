import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, ChangeDetectorRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormatoEmailService } from './../../../../../../../services/formatoEmail.service';
import { AgendaService } from '../../../../../../../services/agenda.service';
import { BackdropService } from '../../../../../../../services/backdrop.service';
import { TransaccionesService } from '../../../../../../../services/transacciones.service';
import { CuentaCorriente } from '../../../../../../../models/cuenta-corriente.model';

// Pipes
import { DatePipe } from '@angular/common';
import { PesosPipe } from '../../../../../../../shared/pipes/pesos.pipe';
import { delay, Observable, of, Subscription } from 'rxjs';

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
  @Output() mostrarBackdropCustomChange = new EventEmitter<boolean>();
  @Output() datosOrdenados = new EventEmitter<void>();

  private pesosPipe = new PesosPipe();

  // Fomularios
  busquedaDestinatarios = new FormControl('');
  transferenciaATercerosForm: FormGroup = new FormGroup({});
  transaccionesCtaCte: CuentaCorriente[] = [];
  saldoUltimaTransaccionCtaCte: number | null = null;
  saldo: number | undefined;

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
  destinatarioSeleccionado: { id_destinatario: any, nombre: any, rut_destinatario:any } | undefined;
  selectedId: any = null;
  nombreDestinatario: any;
  buscadorAgenda = true;

  // Variables para botones
  continuarTransferencia = false;

  // Variables para errores
  error1: boolean = false;
  error2: boolean = false;
  montoValido: boolean = false;
  montoATransferirOk: any;

  // Variables para input
  inputErrorVacioEmail: any;
  inputValidoEmail: any;

  // Variables para modal
  mostrarBackdropCustomModal = false;
  modales: any[] = [];
  mostrarBackdropCustomOffcanvas = new EventEmitter<boolean>();
  mostrarBackdropCustomOffcanvasEstado: boolean = false;;
  // Variable para mensajes de modal eliminar
  usuarioEliminado = false;
  errorServer = false;
  destinatarioSeleccionadoTabla = false;
  destinatarioId: any;
  id_destinatario: any;
  rut_destinatario: any;

  alertaAyuda: boolean = true;

  datosTransferencia: any;
  transferenciaOk: boolean = true;
  tranferenciaError: boolean = false;

  constructor(
    private formatoEmailService: FormatoEmailService,
    private cdr: ChangeDetectorRef,
    private agendaService: AgendaService,
    private backdropService: BackdropService,
    private transaccionesService: TransaccionesService
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
    
    // Aplica pipe pesos
    this.transferenciaATercerosForm.controls['montoATransferir'].valueChanges.subscribe((value) => {
      const transformedValue = this.pesosPipe.transform(value);
      this.transferenciaATercerosForm.controls['montoATransferirOk'].setValue(transformedValue, {emitEvent: false});
    });
  }

  loadData(): void {
    this.agendaService.getAgenda().subscribe((agenda: any) => {
      this.agenda = agenda;
      this.originalData = [...this.agenda];
      this.paginarAgenda();
      this.cdr.detectChanges();
    });

    this.transaccionesService.getTransCuentaCorriente().subscribe((transaccionesCtaCte: CuentaCorriente[]) => {
      if (transaccionesCtaCte) {
        this.transaccionesCtaCte = transaccionesCtaCte;
        this.transaccionesCtaCte.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        this.saldoUltimaTransaccionCtaCte = this.transaccionesCtaCte.length > 0 ? this.transaccionesCtaCte[0].saldo : null;
        console.log('Saldo última transacción:', this.saldoUltimaTransaccionCtaCte);
      }
    });
  }


  seleccionarDestinatario(id_destinatario: any): void {
    // Encuentra el destinatario seleccionado en la lista de destinatarios
    this.destinatarioATransferirSeleccionado = this.agenda.find(agenda => agenda.id === id_destinatario);
  
    // Si no se encontró un destinatario con el ID dado, selecciona el último destinatario
    if (!this.destinatarioATransferirSeleccionado) {
      this.destinatarioATransferirSeleccionado = this.agenda[this.agenda.length - 1];
    }
  
    // Asigna el nombre y rut del destinatario seleccionado
    this.nombreDestinatario = this.destinatarioATransferirSeleccionado.nombre;
    this.rut_destinatario = this.destinatarioATransferirSeleccionado.rut;
  
    // Actualiza los campos del formulario
    this.transferenciaATercerosForm.patchValue({
      montoATransferir: 'Ingresa el monto a transferir', // Vacía el campo 'montoATransferir'
      mensaje: '', // Vacía el campo 'mensaje'
      emailDestinatario: this.destinatarioATransferirSeleccionado.email, // Carga el email del destinatario
    });
  
    // Asigna los valores a las propiedades de la clase
    this.destinatarioSeleccionado = {
      id_destinatario: id_destinatario,
      nombre: this.nombreDestinatario,
      rut_destinatario: this.rut_destinatario
    };
    this.destinatarioId = id_destinatario;
    this.selectedId = id_destinatario;
    this.pasosTransferencia = true;
    this.ingresarDatos = true;
    this.destinatarioSeleccionadoTabla = true;
    this.id_destinatario = this.destinatarioSeleccionado.id_destinatario;
  
    if (this.tablaDestinatarioSeleccionado && this.tablaDestinatarioSeleccionado.nativeElement) {
      this.tablaDestinatarioSeleccionado.nativeElement.classList.add('paso-ok');
    }
  
    console.log('Destinatario seleccionado:', this.destinatarioATransferirSeleccionado);
    console.log('ID Destinatario:', this.id_destinatario);
    console.log('RUT Destinatario:', this.rut_destinatario);
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
      this.validaDatosTransferencia();
    } else {
      this.inputValidoEmail = false;
      this.continuarTransferencia = false;
    }
  }

  validaMontoATransferir(): void {
    const controlMontoATransferir = this.transferenciaATercerosForm.get('montoATransferir');
  
    if (controlMontoATransferir) {
      let montoATransferir = controlMontoATransferir.value;
  
      // Convertir el valor del input a número
      montoATransferir = montoATransferir.replace(/\$|\.| /g, '');
      const numericInputMonto = Number(montoATransferir);
  
      // Validación 1
      if (numericInputMonto === 0 || !numericInputMonto) {
        this.error1 = true;
        this.error2 = false;
        this.montoValido = false;
        console.log('valor 0 o vacío');
      } 
      // Validación 2
      else if (this.saldoUltimaTransaccionCtaCte !== null && numericInputMonto > this.saldoUltimaTransaccionCtaCte) {
        this.error1 = false;
        this.error2 = true;
        this.montoValido = false;
        console.log('valor superior');
      } 
      // Monto válido
      else {
        this.error1 = false;
        this.error2 = false;
        this.montoValido = true;
        console.log('valido');
      }
    }
    this.validaDatosTransferencia();
  }

  validaDatosTransferencia() {
    const controlMontoATransferir = this.transferenciaATercerosForm.get('montoATransferir');
    const controlEmailDestinatario = this.transferenciaATercerosForm.get('emailDestinatario');
  
    if (!controlMontoATransferir || !controlEmailDestinatario) {
      this.continuarTransferencia = false; // Deshabilita el botón si los controles no existen
      return;
    }
  
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

  cambiarDestinatario(): void {
    this.pasosTransferencia = false;
    this.ingresarDatos = false;
    this.confirmarDatos = false;
    this.transferenciaARealizar = false;
    this.destinatarioSeleccionadoTabla = false;
    this.destinatarioSeleccionado = { id_destinatario: undefined, nombre: undefined, rut_destinatario: undefined };
    this.agendaService.getAgenda().subscribe(data => {
      this.agenda = [...data];
      this.paginatedAgenda = this.agenda.slice(0, this.itemsPerPage).map(agenda => ({
        ...agenda,
        selected: false
      }));
      this.totalPages = this.agenda ? Math.ceil(this.agenda.length / this.itemsPerPage) : 0;
      this.cdr.detectChanges();
    });
    this.selectedId = null;
    this.buscadorAgenda = true;
    this.cdr.detectChanges();
    this.mostrarBackdropCustomModal = false;

    if (this.tablaDestinatarioSeleccionado && this.tablaDestinatarioSeleccionado.nativeElement) {
      this.tablaDestinatarioSeleccionado.nativeElement.classList.remove('paso-ok');
    }

    // Cierra el modal y oculta el backdrop-custom
    const modalCambiosDestinatario = this.modales.find(modal => modal._element.id === 'modalCambiosDestinatario');
    if (modalCambiosDestinatario) {
      modalCambiosDestinatario.hide();
      this.mostrarBackdropCustomModal = true;
    }
    
  }

  soloNumeros(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  botonContinuar(){
    if (this.paso1 && this.paso1.nativeElement) {
      this.paso1.nativeElement.classList.add('paso-ok');
    }
    if (this.cambiaDestinatario && this.cambiaDestinatario.nativeElement) {
      this.cambiaDestinatario.nativeElement.disabled = true;
    }
    if (this.inputMontoATransferir && this.inputMontoATransferir.nativeElement) {
      this.inputMontoATransferir.nativeElement.disabled = true;
    }
    if (this.mensaje && this.mensaje.nativeElement) {
      this.mensaje.nativeElement.disabled = true;
    }
    this.montoValido = false;
    this.confirmarDatos = true;
    this.btnContinuar = false;
  }

  botonModificarDatos(): void {
    this.ingresarDatos = true;
    this.confirmarDatos = false;
    this.transferenciaARealizar = false;
    this.btnContinuar = true;
    if (this.inputMontoATransferir && this.inputMontoATransferir.nativeElement) {
      this.inputMontoATransferir.nativeElement.disabled = false;
    }
    if (this.mensaje && this.mensaje.nativeElement) {
      this.mensaje.nativeElement.disabled = false;
    }
    if (this.paso1 && this.paso1.nativeElement) {
      this.paso1.nativeElement.classList.remove('paso-ok');
    }
    if (this.cambiaDestinatario && this.cambiaDestinatario.nativeElement) {
      this.cambiaDestinatario.nativeElement.disabled = false;
    }
  }

  botonConfirmarDatos(){
    if (this.paso2 && this.paso2.nativeElement) {
      this.paso2.nativeElement.classList.add('paso-ok');
    }
    this.transferenciaARealizar = true;
    this.btnConfirmar = false;
  }

  botonValidaDatosTransferencia(){
    this.ingresarDatos = true;
    this.confirmarDatos = false;
  }

  // Agregar nuevo destinatario
  abrirOffcanvas(): void {
    this.mostrarBackdropCustomOffcanvas.emit(true);
    this.mostrarBackdropCustomOffcanvasEstado = true;
  }

  botonCancelarTransferencia(): void {
    this.pasosTransferencia = false;
    this.ingresarDatos = false;
    this.confirmarDatos = false;
    this.transferenciaARealizar = false;
    this.destinatarioSeleccionadoTabla = false;
    this.destinatarioSeleccionado = { id_destinatario: undefined, nombre: undefined, rut_destinatario: undefined };
    this.agendaService.getAgenda().subscribe(data => {
      // Hacer una copia de los datos
      this.agenda = [...data];
      this.ordenarDatos('nombre');
      this.paginatedAgenda = this.agenda.slice(0, this.itemsPerPage).map(agenda => ({
        ...agenda,
        selected: false
      }));
      this.totalPages = this.agenda ? Math.ceil(this.agenda.length / this.itemsPerPage) : 0;
      this.cdr.detectChanges();
    });
    this.selectedId = null;
    // this.tablaDestinatarios = true;
    this.buscadorAgenda = true;
    this.cdr.detectChanges();

    // Cierra el modal y oculta el backdrop-custom
    const modalCambiosDestinatario = this.modales.find(modal => modal._element.id === 'modalCambiosDestinatario');
    if (modalCambiosDestinatario) {
      modalCambiosDestinatario.hide();
    }
    this.mostrarBackdropCustomModal = false;

    if (this.paso1 && this.paso1.nativeElement && this.paso2 && this.paso2.nativeElement) {
      this.paso1.nativeElement.classList.remove('paso-ok');
      this.paso2.nativeElement.classList.remove('paso-ok');
    }

    if (this.cambiaDestinatario && this.cambiaDestinatario.nativeElement) {
      this.cambiaDestinatario.nativeElement.disabled = false;
    }
    if (this.inputMontoATransferir && this.inputMontoATransferir.nativeElement) {
      this.inputMontoATransferir.nativeElement.disabled = false;
    }
    if (this.mensaje && this.mensaje.nativeElement) {
      this.mensaje.nativeElement.disabled = false;
    }
    this.btnConfirmar = true;
    this.btnContinuar = true;
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

  abrirModalCambioDestinatario(): void {
    var modalCambiosDestinatario = new bootstrap.Modal(document.getElementById('modalCambiosDestinatario'), {});
    modalCambiosDestinatario.show();
  }

  abrirModalCancelarTransferencia(): void {
    var modalCancelarTransferencia = new bootstrap.Modal(document.getElementById('modalCancelarTransferencia'), {});
    modalCancelarTransferencia.show();
  }

  ocultaBackDrop(): void {
    this.backdropService.hide();
  }

  ocultaMensaje() {
    this.alertaAyuda = false;
  }

  abrirModalTransferencia(): void {
    var modalTransferencia = new bootstrap.Modal(document.getElementById('modalTransferencia'), {});
    modalTransferencia.show();
    this.realizarTransferencia();
    /*this.realizarTransferencia().subscribe(datosTransferencia => {
      this.transaccionesService.guardarNuevaTransferencia(datosTransferencia);
      of(null).pipe(
        delay(1500)
      ).subscribe(() => this.backdropService.hide());
    });*/
  }

  calculoTransferencia(): any {
    let montoATransferir: any = this.transferenciaATercerosForm.get('montoATransferir')?.value;
    montoATransferir = montoATransferir.replace(/\D/g, ''); // Asegúrate de que sea un número
    
    // Convertir montoATransferir a número
    montoATransferir = Number(montoATransferir);
    
    // Resta montoATransferir a cupoCtaCte
    if (this.saldoUltimaTransaccionCtaCte !== null) {
      this.saldoUltimaTransaccionCtaCte -= montoATransferir;
      console.log('Saldo última transacción:', this.saldoUltimaTransaccionCtaCte);
    }
  
    return {
      montoTransferido: montoATransferir,
      saldoUltimaTransaccionCtaCte: this.saldoUltimaTransaccionCtaCte,
      montoParaTransferencia: montoATransferir
    };
  }

  // Envia datos de transferencia
  realizarTransferencia(): Observable<any> {
    const datePipe = new DatePipe('en-US');
    const fecha = new Date();
    const fechaFormateada = datePipe.transform(fecha, 'yyyy-MM-dd');

    const result = this.calculoTransferencia();

    let montoTransferido = result.montoTransferido;

    this.datosTransferencia = {
      id_trans_cta_cte: this.transaccionesCtaCte.length + 1,
      fecha: fechaFormateada,
      detalle: 'Transferencia a ' + this.nombreDestinatario,
      transferencia: 1,
      id_destinatario: this.id_destinatario,
      nombre_destinatario: this.nombreDestinatario,
      rut_destinatario: this.rut_destinatario,
      mensaje: this.transferenciaATercerosForm.get('mensaje')?.value,
      cargo: montoTransferido,
      saldo: this.saldoUltimaTransaccionCtaCte
    };
  
    console.table(this.datosTransferencia);
    return of(this.datosTransferencia);
  
    // Llamar al servicio para guardar la nueva transferencia
    //return this.transaccionesService.guardarNuevaTransferencia(this.datosTransferencia, montoATransferirOkNum);
  }
}


