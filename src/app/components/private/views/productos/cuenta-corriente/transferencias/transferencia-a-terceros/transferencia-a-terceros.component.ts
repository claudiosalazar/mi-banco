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
  resultados: any[] = [];
  transferenciaATercerosForm: FormGroup = new FormGroup({});
  transaccionesCtaCte: CuentaCorriente[] = [];
  saldoUltimaTransaccionCtaCte: number | null = null;
  saldo: number | undefined;

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
  agendaSeleccionado: { id_agenda: any, nombre: any, rut_destinatario:any, rut: any, email: any } | undefined;
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


  constructor(
    private formatoEmailService: FormatoEmailService,
    private cdr: ChangeDetectorRef,
    private agendaService: AgendaService,
    private backdropService: BackdropService,
    private transaccionesService: TransaccionesService,
    private urlBrowserService: UrlBrowserService
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
          console.error('No se encontró id_user en el almacenamiento');
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
      this.agendaService.getAgendaIdUser(idUserNumber).subscribe(
        (data: Agenda[]) => {
          // Aquí capturas los datos de la agenda
          console.log('Datos de la agenda:', data);
          // Puedes asignar los datos a una propiedad del componente si es necesario
          this.agenda = data;
          this.originalData = [...data]; // Guardar una copia de los datos originales
          this.paginarAgenda();
        },
        (error) => {
          console.error('Error al obtener la agenda:', error);
        }
      );
    } else {
      console.error('No se encontró id_user en el almacenamiento');
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

  seleccionarDestinatario(id_agenda: number) {
    // Encuentra el destinatario seleccionado en la lista de destinatarios
    const destinatario = this.paginatedAgenda.find(agenda => agenda.id_agenda === id_agenda);
    this.destinatarioSeleccionado = true;
    this.destinatarioSeleccionadoTabla = true;
    this.buscadorAgenda = false;
    // Almacenar el destinatario seleccionado
    this.destinatarioATransferirSeleccionado = destinatario;
  
    // Actualizar el ID seleccionado
    this.selectedId = id_agenda;
  
    // Mostrar el formulario
    this.ingresarDatos = true;
    this.pasosTransferencia = true;
  
    this.transferenciaATercerosForm.patchValue({
      emailDestinatario: this.destinatarioATransferirSeleccionado.email, // Carga el email del destinatario
    });
  
    // Log para comprobar el destinatario seleccionado
    console.log('Destinatario seleccionado:', destinatario);
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
  
    this.selectedId = null;
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
    this.id_agenda = { id_agenda: undefined, nombre: undefined, rut_destinatario: undefined, rut: undefined, email: undefined };
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

  abrirModalTransferencia(): void {
    var modalTransferencia = new bootstrap.Modal(document.getElementById('modalTransferencia'), {});
    modalTransferencia.show();
    this.realizarTransferencia().subscribe(datosTransferencia => {
      console.log('Datos de transferencia capturados:', datosTransferencia); // Verificar datos capturados
      this.transaccionesService.guardarNuevaTransferencia(datosTransferencia).subscribe(
        (response) => {
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
        (error) => {
          console.error('Error al guardar la transferencia:', error); // Manejar errores
          this.transferenciaOk = false;
          this.tranferenciaError = true;
        }
      );
    });
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
      id_agenda: this.id_agenda,
      nombre_destinatario: this.nombreDestinatario,
      rut_destinatario: this.rut_destinatario,
      mensaje: this.transferenciaATercerosForm.get('mensaje')?.value,
      cargo: montoTransferido,
      saldo: this.saldoUltimaTransaccionCtaCte
    };
  
    console.table(this.datosTransferencia);
    
  
    // Llamar al servicio para guardar la nueva transferencia
    return of (this.datosTransferencia);
  }

  onCancelar(): void {
    this.mostrarBackdropCustomOffcanvas.emit(false);
    this.mostrarBackdropCustomOffcanvasEstado = false;
  }
}


