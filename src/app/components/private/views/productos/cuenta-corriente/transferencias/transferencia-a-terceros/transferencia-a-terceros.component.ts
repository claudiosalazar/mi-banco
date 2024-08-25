import { Component, ElementRef, EventEmitter, OnInit, OnDestroy, Output, ViewChild, ChangeDetectorRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormatoEmailService } from './../../../../../../../services/formatoEmail.service';
import { AgendaService } from '../../../../../../../services/agenda.service';
import { BackdropService } from '../../../../../../../services/backdrop.service';
import { TransaccionesService } from '../../../../../../../services/transacciones.service';
import { CuentaCorriente } from '../../../../../../../models/cuenta-corriente.model';
import { UrlBrowserService } from '../../../../../../../services/urlBrowser.service';
import { Agenda } from '../../../../../../../models/agenda.model';

// Pipes
import { DatePipe } from '@angular/common';
import { PesosPipe } from '../../../../../../../shared/pipes/pesos.pipe';
import { delay, Subscription, Observable, of, switchMap, debounceTime, distinctUntilChanged, tap } from 'rxjs';

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
export class TransferenciaATercerosComponent implements OnInit, OnDestroy {

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
  private backdropSubscription: Subscription | undefined;
  private subscription: Subscription | undefined;

  // Fomularios
  busquedaDestinatarios = new FormControl('');
  transferenciaATercerosForm: FormGroup = new FormGroup({});
  resultados: any[] = [];

  transaccionesCtaCte: CuentaCorriente[] = [];
  opcionesDePago: { value: string, label: string }[] = [
    { value: '0', label: 'Cuenta Corriente' },
    { value: '1', label: 'Línea de Crédito' },
  ];
  productoSeleccionado: any;
  saldoUltimaTransaccionCtaCte: any;
  saldoUltimaTransaccionLineaCredito: any;
  cupoUsadoUltimaTransaccionLineaCredito: any;
  nuevoSaldoCtaCte: any;
  nuevoSaldoLineaCredito: any;
  allTransCtaCte: any[] = [];
  allTransLineaCredito: any[] = [];

  // Variable para animacion de icono en th
  agenda: any[] = [];
  modales: any[] = [];
  paginatedAgenda: any[] = [];
  originalData: any[] = [];
  itemsPerPage: any;
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
  destinatarioATransferirSeleccionado: any = null;
  agendaSeleccionado: { id_agenda: any, nombre: any, rut: any, email: any } | undefined;
  selectedIdAgenda: any = null;
  selectedNombreDestinatario: any;
  selectedRutDestinatario: any;
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

  // Variable para backdrop offcanvas
  mostrarBackdropCustomOffcanvas = new EventEmitter<boolean>();
  mostrarBackdropCustomOffcanvasEstado: boolean = false;
  
  // Variables para backdrop modal
  mostrarBackdropCustomModal = new EventEmitter<boolean>();
  mostrarBackdropCustomModalEstado: boolean = false;

  // Variable para mensajes de modal eliminar
  usuarioEliminado = false;
  errorServer = false;
  destinatarioSeleccionadoTabla = false;
  destinatarioSeleccionado = false;
  destinatarioId: any;
  id_agenda: any;
  rut_destinatario: any;
  nombre_destinatario: any;

  // Variables para modal nuevo destinatario
  datosNuevoDestinatario: any;
  enviandoNuevoDestinatario: boolean = true;
  datosGuardadosNuevoDestinatario: boolean = false;
  errorServerNuevoDestinatario: boolean = false;
  datosCapturados: any;

  alertaAyuda: boolean = true;

  datosTransferencia: any;
  transferenciaOk: boolean = true;
  tranferenciaError: boolean = false;

  tablaConDatos: boolean = true;
  mostrarAlerta: boolean = false;
  transferenciaConCtaCte: boolean | undefined;
  transferenciaConLineaCredito: boolean | undefined;


  constructor(
    private formatoEmailService: FormatoEmailService,
    private cdr: ChangeDetectorRef,
    private agendaService: AgendaService,
    private backdropService: BackdropService,
    private transaccionesService: TransaccionesService,
    private urlBrowserService: UrlBrowserService,
  ) { }

  ngOnInit() {
    this.loadData();
    
    this.transferenciaATercerosForm = new FormGroup({
      destinatarioATransferir: new FormControl(''),
      destinatarioSeleccionado: new FormControl(''),
      productoParaPago: new FormControl('', [Validators.required]),
      montoATransferir: new FormControl('', [Validators.required]),
      mensaje: new FormControl(''),
      emailDestinatario: new FormControl({ value: '', disabled: true }, [Validators.required]),
      montoATransferirOk: new FormControl(''),
      mensajeOk: new FormControl(''),
      emailDestinatarioOk: new FormControl(''),
    });

    this.transferenciaATercerosForm.patchValue({
      productoParaPago: '0'
    });
    
    // Aplica pipe pesos
    this.transferenciaATercerosForm.controls['montoATransferir'].valueChanges.subscribe((value) => {
      const transformedValue = this.pesosPipe.transform(value);
      this.transferenciaATercerosForm.controls['montoATransferirOk'].setValue(transformedValue, {emitEvent: false});
    });

    this.busquedaDestinatarios.valueChanges.pipe(
      distinctUntilChanged(),
      switchMap(valorBusqueda => {
        const storedIdUser = localStorage.getItem('id_user');
        if (storedIdUser) {
          const idUserNumber = parseInt(storedIdUser, 10);
          if (valorBusqueda) {
            return this.agendaService.filtrarAgenda(idUserNumber, valorBusqueda);
          } else {
            this.currentPage = 1;
            this.agenda = [...this.originalData];
            this.paginarAgenda();
            this.cdr.detectChanges();
            if (this.mostrarAlerta === true || this.currentPage === 0) {
              this.loadData();
            }
            return of(this.originalData);
          }
        } else {
          return of([]);
        }
      })
    ).subscribe(datosFiltrados => {
      this.handleDatosFiltrados(datosFiltrados);
    });
  }

  ngOnDestroy(): void {
    // Es importante cancelar la suscripción para evitar fugas de memoria
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.backdropSubscription) {
      this.backdropSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(_e: Event): void {
    this.modales = Array.from(document.querySelectorAll('.modal')).map(el => {
      const modal = new bootstrap.Modal(el);
      el.addEventListener('show.bs.modal', () => {
        this.backdropService.showModalBackdrop();  // Muestra el backdrop
      });
      el.addEventListener('hide.bs.modal', () => {
        this.backdropService.hideModalBackdrop();  // Oculta el backdrop
      });
      return modal;
    });

    this.subscription = this.agendaService.destinatarioActualizado$.subscribe(() => {
      this.loadData();
    });

    this.subscription.add(
      this.agendaService.destinatarioAgregado$.subscribe(() => {
        this.loadData();
      })
    );

    this.subscription.add(
      this.agendaService.getDatosNuevoDestinatario().subscribe(datos => {
        this.datosCapturados = datos;
        this.backdropService.hideOffcanvasBackdrop();
        this.abrirModalNuevoDestinatario();
      })
    );
  }

  loadData() {
    const idUser = localStorage.getItem('id_user'); // O sessionStorage.getItem('id_user')
    if (idUser) {
      const idUserNumber = parseInt(idUser, 0);
  
      // Obtener transacciones de cuenta corriente
      this.transaccionesService.getTransCuentaCorriente(idUserNumber).subscribe(
        (dataCtaCte: any[]) => {
          if (dataCtaCte.length > 0) {
            const ultimaTransCtaCte = dataCtaCte[dataCtaCte.length - 1];
            this.saldoUltimaTransaccionCtaCte = parseFloat(ultimaTransCtaCte.saldo);
          }
        }
      );
  
      // Obtener transacciones de línea de crédito
      this.transaccionesService.getTransLineaCredito(idUserNumber).subscribe(
        (dataLineaCredito: any[]) => {
          if (dataLineaCredito.length > 0) {
            const ultimaTransLineaCredito = dataLineaCredito[dataLineaCredito.length - 1];
            this.saldoUltimaTransaccionLineaCredito = parseFloat(ultimaTransLineaCredito.saldo);
            this.cupoUsadoUltimaTransaccionLineaCredito = parseFloat(ultimaTransLineaCredito.cupo_usado);
          }
        }
      );

      // Obtener transacciones de cuenta corriente
      this.transaccionesService.getIdTransCtaCte().subscribe(
        (dataCtaCte: any[]) => {
          if (dataCtaCte.length > 0) {
            this.allTransCtaCte = dataCtaCte.map(trans => trans.id_trans_cta_cte);
          }
        }
      );
  
      // Obtener transacciones de línea de crédito
      this.transaccionesService.getIdTransLineaCredito().subscribe(
        (dataLineaCredito: any[]) => {
          if (dataLineaCredito.length > 0) {
            this.allTransLineaCredito = dataLineaCredito.map(trans => trans.id_trans_linea_cre);
          }
        }
      );
  
      // Obtener datos de la agenda
      this.agendaService.getAgendaIdUser(idUserNumber).subscribe(
        (data: Agenda[]) => {
          // Puedes asignar los datos a una propiedad del componente si es necesario
          this.agenda = data;
          this.originalData = [...data]; // Guardar una copia de los datos originales
          this.paginarAgenda();
        }
      );
    }
  }

  handleDatosFiltrados(datosFiltrados: Agenda[]) {
    this.agenda = datosFiltrados;
    this.totalPages = this.agenda ? Math.ceil(this.agenda.length / this.itemsPerPage) : 0;
    this.paginarAgenda();
    this.cdr.detectChanges();
  
    // Aplicar la lógica de verificación de datos
    if (this.agenda.length === 0) {
      this.tablaConDatos = false;
      this.mostrarAlerta = true;
    } else {
      this.tablaConDatos = true;
      this.mostrarAlerta = false;
    }
  }

  onProductoSeleccionado(value: any): void {
    this.productoSeleccionado = value;
  }

  seleccionarDestinatario(id_agenda: number) {
    // Encuentra el destinatario seleccionado en la lista de destinatarios
    const destinatario = this.paginatedAgenda.find(agenda => agenda.id_agenda === id_agenda);
    this.destinatarioSeleccionado = true;
    this.destinatarioSeleccionadoTabla = true;
    this.buscadorAgenda = false;
    // Almacenar el destinatario seleccionado
    this.destinatarioATransferirSeleccionado = destinatario;
  
    // Actualizar el ID seleccionado
    this.selectedIdAgenda = id_agenda;
  
    // Guardar los datos del destinatario en las variables correspondientes
    this.selectedIdAgenda = destinatario.id_agenda;
    this.selectedNombreDestinatario = destinatario.nombre;
    this.selectedRutDestinatario = destinatario.rut;
  
    // Mostrar el formulario
    this.ingresarDatos = true;
    this.pasosTransferencia = true;
  
    this.transferenciaATercerosForm.patchValue({
      productoSeleccionado: this.productoSeleccionado, // Carga el producto seleccionado
      emailDestinatario: this.destinatarioATransferirSeleccionado.email, // Carga el email del destinatario
    });
    console.log('Destinatario seleccionado:', this.destinatarioATransferirSeleccionado);
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
      } 
      // Validación 2
      else if (this.saldoUltimaTransaccionCtaCte !== null && numericInputMonto > this.saldoUltimaTransaccionCtaCte) {
        this.error1 = false;
        this.error2 = true;
        this.montoValido = false;
      } 
      // Monto válido
      else {
        this.error1 = false;
        this.error2 = false;
        this.montoValido = true;
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
    this.busquedaDestinatarios.enable();
    this.pasosTransferencia = false;
    this.ingresarDatos = false;
    this.confirmarDatos = false;
    this.transferenciaARealizar = false;
    this.destinatarioSeleccionadoTabla = false;
    this.id_agenda = { id_agenda: undefined, nombre: undefined, rut_destinatario: undefined, rut: undefined, email: undefined };
  
    // Obtener el valor de id_user del almacenamiento y convertirlo a número
    const idUser = Number(localStorage.getItem('id_user'));
  
    // Pasar id_user como parámetro al servicio
    this.agendaService.getAgendaIdUser(idUser).subscribe(data => {
      this.agenda = [...data];
      this.paginatedAgenda = this.agenda.slice(0, this.itemsPerPage).map(agenda => ({
        ...agenda,
        selected: false
      }));
      this.totalPages = this.agenda ? Math.ceil(this.agenda.length / this.itemsPerPage) : 0;
      this.cdr.detectChanges();
    });
  
    this.selectedIdAgenda = null;
    this.buscadorAgenda = true;
    this.cdr.detectChanges();
    this.mostrarBackdropCustomModalEstado = false;
  
    if (this.tablaDestinatarioSeleccionado && this.tablaDestinatarioSeleccionado.nativeElement) {
      this.tablaDestinatarioSeleccionado.nativeElement.classList.remove('paso-ok');
    }
  
    // Cierra el modal y oculta el backdrop-custom
    const modalCambiosDestinatario = this.modales.find(modal => modal._element.id === 'modalCambiosDestinatario');
    if (modalCambiosDestinatario) {
      modalCambiosDestinatario.hide();
      this.mostrarBackdropCustomModalEstado = true;
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

  botonCancelarTransferencia(): void {
    this.pasosTransferencia = false;
    this.ingresarDatos = false;
    this.confirmarDatos = false;
    this.transferenciaARealizar = false;
    this.destinatarioSeleccionadoTabla = false;
    this.id_agenda = { id_agenda: undefined, nombre: undefined, rut_destinatario: undefined, rut: undefined, email: undefined };
    const idUser = Number(localStorage.getItem('id_user'));

    this.agendaService.getAgendaIdUser(idUser).subscribe(data => {
      this.agenda = [...data];
      this.paginatedAgenda = this.agenda.slice(0, this.itemsPerPage).map(agenda => ({
        ...agenda,
        selected: false
      }));
      this.totalPages = this.agenda ? Math.ceil(this.agenda.length / this.itemsPerPage) : 0;
      this.cdr.detectChanges();
    });
    this.selectedIdAgenda = null;
    // this.tablaDestinatarios = true;
    this.buscadorAgenda = true;
    this.cdr.detectChanges();

    // Cierra el modal y oculta el backdrop-custom
    const modalCambiosDestinatario = this.modales.find(modal => modal._element.id === 'modalCambiosDestinatario');
    if (modalCambiosDestinatario) {
      modalCambiosDestinatario.hide();
    }
    this.mostrarBackdropCustomModalEstado = false;

    if (this.paso1 && this.paso1.nativeElement && this.paso2 && this.paso2.nativeElement) {
      this.paso1.nativeElement.classList.remove('paso-ok');
      this.paso2.nativeElement.classList.remove('paso-ok');
    }

    if (this.cambiaDestinatario && this.cambiaDestinatario.nativeElement) {
      this.cambiaDestinatario.nativeElement.disabled = false;
    }
    if (this.inputMontoATransferir && this.inputMontoATransferir.nativeElement) {
      this.inputMontoATransferir.nativeElement.disabled = false;
      this.inputMontoATransferir.nativeElement.value = '';
    }
    if (this.mensaje && this.mensaje.nativeElement) {
      this.mensaje.nativeElement.disabled = false;
      this.mensaje.nativeElement.value = '';
    }
    this.btnConfirmar = true;
    this.btnContinuar = true;
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
    this.mostrarBackdropCustomModal.emit(true);
    this.mostrarBackdropCustomModalEstado = true;
  }

  abrirModalCancelarTransferencia(): void {
    var modalCancelarTransferencia = new bootstrap.Modal(document.getElementById('modalCancelarTransferencia'), {});
    modalCancelarTransferencia.show();
  }

  ocultaBackDrop(): void {
    this.mostrarBackdropCustomOffcanvas.emit(false);
    this.mostrarBackdropCustomOffcanvasEstado = false;
  }

  ocultaMensaje() {
    this.alertaAyuda = false;
  }

  abrirModalNuevoDestinatario(): void {
    var modalNuevoDestinatario = new bootstrap.Modal(document.getElementById('modalNuevoDestinatario'), {});
    modalNuevoDestinatario.show();
    this.ocultaBackDrop();
    //this.backdropService.showModalBackdrop();
    // this.backdropService.hideOffcanvasBackdrop();
    this.enviandoNuevoDestinatario = true;

    // Envía los datos al servicio
    this.agendaService.guardarNuevoDestinatario(this.datosCapturados).subscribe(nuevoDestinatario => {

      setTimeout(() => {
        this.enviandoNuevoDestinatario = false;
        this.datosGuardadosNuevoDestinatario = true;
      }, 2000);

      // Ensure destinatarios is an array before pushing
      if (!this.agenda) {
        this.agenda = [];
      }
      this.agenda.push(nuevoDestinatario);

      // Ordena los destinatarios por nombre en orden ascendente
      this.agenda = this.agenda?.sort((a, b) => {
        if (a.nombre && b.nombre) {
          return a.nombre.localeCompare(b.nombre);
        } else {
          return 0;
        }
      });

      // Forzar la actualización de los datos en la tabla
      this.agenda = [...this.agenda];
      this.cdr.detectChanges();
    }, _error => {
      setTimeout(() => {
        this.enviandoNuevoDestinatario = false;
        this.errorServerNuevoDestinatario = true;
      }, 2000);
    });
  }

  calculoTransferencia(): any {
    let montoATransferir: any = this.transferenciaATercerosForm.get('montoATransferir')?.value;
    montoATransferir = montoATransferir.replace(/\D/g, ''); // Asegúrate de que sea un número
    
    // Convertir montoATransferir a número
    montoATransferir = Number(montoATransferir);
    
    let nuevoSaldo: number;
    let nuevoCupoUsado: number;
  
    // Resta montoATransferir a cupoCtaCte
    if (this.productoSeleccionado === '0') {
      nuevoSaldo = this.saldoUltimaTransaccionCtaCte - montoATransferir;
      return {
        montoTransferido: montoATransferir,
        nuevoSaldo: nuevoSaldo
      };
    } else if (this.productoSeleccionado === '1') {
      nuevoSaldo = this.saldoUltimaTransaccionLineaCredito - montoATransferir;
      nuevoCupoUsado = this.cupoUsadoUltimaTransaccionLineaCredito + montoATransferir;
      return {
        montoTransferido: montoATransferir,
        nuevoSaldo: nuevoSaldo,
        nuevoCupoUsado: nuevoCupoUsado
      };
    } else {
      throw new Error('Producto no válido seleccionado');
    }
  }

  abrirModalTransferencia(): void {
    const modalTransferencia = new bootstrap.Modal(document.getElementById('modalTransferencia'), {});
    modalTransferencia.show();
    
    this.realizarTransferencia().subscribe(datosTransferencia => {
      console.log('Datos de transferencia capturados:', datosTransferencia); // Verificar datos capturados

      // Detectar el producto seleccionado
      const productoSeleccionado = this.transferenciaATercerosForm.get('productoParaPago')?.value;

      let guardarTransferenciaObservable: Observable<any>;

      switch (productoSeleccionado) {
        case '0':
          // Producto 0: Cuenta Corriente
          guardarTransferenciaObservable = this.transaccionesService.guardarNuevaTransferenciaCtaCte(datosTransferencia);
          break;
        case '1':
          // Producto 1: Línea de Crédito
          guardarTransferenciaObservable = this.transaccionesService.guardarNuevaTransferenciaLineaCredito(datosTransferencia);
          break;
        default:
          console.error('Producto no válido seleccionado');
          this.transferenciaOk = false;
          this.tranferenciaError = true;
          return;
      }

      guardarTransferenciaObservable.subscribe(
        response => {
          console.log('Transferencia guardada correctamente:', response); // Verificar respuesta del servicio
          this.transferenciaOk = true;
          this.tranferenciaError = false;
          of(null).pipe(
            delay(1500)
          ).subscribe(() => {
            this.backdropService.hideModalBackdrop();
            modalTransferencia.hide();
            this.urlBrowserService.navegarAComprobanteTransferencia(); // Navegar a comprobante de transferencia
          });
        },
        error => {
          console.error('Error al guardar la transferencia:', error);
          this.transferenciaOk = false;
          this.tranferenciaError = true;
        }
      );
    });
  }

  // Envia datos de transferencia
  realizarTransferencia(): Observable<any> {
    const productoCtaCte = '0';
    const productoLineaCredito = '1';
    const nombreProducto1 = 'Cuenta Corriente';
    const nombreProducto2 = 'Línea de Crédito';
  
    const result = this.calculoTransferencia();
    console.log('Resultado del cálculo:', result);
  
    let nombreProducto = '';
    let tipoProducto = '';
  
    const productoParaPagoValue = this.transferenciaATercerosForm.get('productoParaPago')?.value;
    if (productoParaPagoValue === productoCtaCte) {
      nombreProducto = nombreProducto1;
      tipoProducto = 'Cuenta Corriente';
      this.transferenciaConCtaCte = true;
      this.transferenciaConLineaCredito = false;
    } else if (productoParaPagoValue === productoLineaCredito) {
      nombreProducto = nombreProducto2;
      tipoProducto = 'Línea de Crédito';
      this.transferenciaConCtaCte = false;
      this.transferenciaConLineaCredito = true;
    }
  
    if (this.transferenciaConCtaCte) {
      return this.realizarTransferenciaConCtaCte(result);
    } else if (this.transferenciaConLineaCredito) {
      return this.realizarTransferenciaConLineaCredito(result);
    }
  
    throw new Error('Producto no válido seleccionado');
  }
  
  realizarTransferenciaConCtaCte(result: any): Observable<any> {
    let nuevoIdTransCtaCte = this.allTransCtaCte.length > 0 ? Math.max(...this.allTransCtaCte) + 1 : 1;
    this.allTransCtaCte.push(nuevoIdTransCtaCte);
  
    let detalle = 'Transferencia a ' + (this.selectedNombreDestinatario || 'Destinatario desconocido');
    detalle = String(detalle);
  
    this.datosTransferencia = {
      id_trans_cta_cte: nuevoIdTransCtaCte,
      detalle: detalle,
      transferencia: 1,
      id_destinatario: this.selectedIdAgenda,
      nombre_destinatario: this.selectedNombreDestinatario,
      rut_destinatario: Number(this.selectedRutDestinatario), // Convertir a número
      mensaje: this.transferenciaATercerosForm.get('mensaje')?.value,
      abono: null,
      cargo: result.montoTransferido,
      saldo: result.nuevoSaldo
    };
  
    return of(this.datosTransferencia); // Retornar un Observable
  }
  
  realizarTransferenciaConLineaCredito(result: any): Observable<any> {
    let nuevoIdTransLineaCredito = this.allTransLineaCredito.length > 0 ? Math.max(...this.allTransLineaCredito) + 1 : 1;
    this.allTransLineaCredito.push(nuevoIdTransLineaCredito);
  
    let detalle = 'Transferencia a ' + (this.selectedNombreDestinatario || 'Destinatario desconocido');
    detalle = String(detalle);
  
    this.datosTransferencia = {
      id_trans_linea_cre: nuevoIdTransLineaCredito,
      detalle: detalle,
      transferencia: 1,
      id_destinatario: this.selectedIdAgenda,
      nombre_destinatario: this.selectedNombreDestinatario,
      rut_destinatario: Number(this.selectedRutDestinatario), // Convertir a número
      mensaje: this.transferenciaATercerosForm.get('mensaje')?.value,
      cargo: result.montoTransferido,
      abono: null,
      saldo: result.nuevoSaldo,
      cupo_usado: result.nuevoCupoUsado
    };
  
    return of(this.datosTransferencia); // Retornar un Observable
  }

  onCancelar(): void {
    this.mostrarBackdropCustomOffcanvas.emit(false);
    this.mostrarBackdropCustomOffcanvasEstado = false;
  }
}
