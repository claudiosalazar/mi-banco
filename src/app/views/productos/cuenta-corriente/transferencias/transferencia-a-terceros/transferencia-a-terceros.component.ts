import { Component, OnInit, ElementRef, ViewChild, OnDestroy, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subscription, Observable, of, from, throwError, interval as observableInterval } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, delay, map, switchMap, tap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';


import { AgendaDestinatariosService } from '../../../../../core/services/agenda-destinatarios.service';
import { ProductosUsuarioService } from '../../../../../core/services/productos-usuario.service';
import { FormatoEmailService } from '../../../../../core/services/formato-email.service';
import { PesosPipe } from '../../../../../shared/pipes/pesos.pipe';
import { HttpClient } from '@angular/common/http';
import { BackdropService } from '../../../../../core/services/backdrop.service';

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
export class TransferenciaATercerosComponent implements OnInit, OnDestroy{

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

  baseUrl = 'http://localhost:3000';

  //destinatarios: { [key: string]: any }[] | undefined;
  destinatarioSeleccionado: { id: any, nombre?: string } | undefined;
  destinatarioId: string | null | undefined;
  productosUsuario: { productos: any[] } = { productos: [] };

  destinatarios: any[] = [];
  paginatedDestinatarios: any[] = [];

  private subscription: Subscription | undefined;
  private backdropSubscription: Subscription | undefined;

  private pesosPipe = new PesosPipe();

  // Variables para ordenar datos de tabla
  sortOrder = 1;
  sortedColumn = '';
  sortAscending: boolean = true;

  // Variables para paginador
  paginatedData: any[] | undefined;
  itemsPerPage: number = 5;
  currentPage: number = 1;
  totalPages: number | undefined;
  mostrarPaginador: boolean = true;

  // Variable para animacion de icono en th
  public isRotatedIn: boolean = false;
  public columnaSeleccionada: string = '';

  // Variable para mensajes de modal eliminar
  usuarioEliminado = false;
  errorServer = false;
  destinatarioSeleccionadoTabla = false;

  // Variables para modal de nuevo destinatario
  datosNuevoDestinatario: any;
  enviandoNuevoDestinatario: boolean = true;
  datosGuardadosNuevoDestinatario: boolean = false;
  errorServerNuevoDestinatario: boolean = false;

  // Variables para modal de nuevo destinatario
  datosDestinatarioEditado: any;
  enviandoDestinatarioEditado: boolean = true;
  datosGuardadosDestinatarioEditado: boolean = false;
  errorServerDestinatarioEditado: boolean = false;

  datosCapturados: any;

  mostrarBackdropCustomModal = false;
  modales: any[] = [];
  mostrarBackdropCustomOffcanvas = new EventEmitter<boolean>();
  mostrarBackdropCustomOffcanvasEstado: boolean = false;

  busquedaDestinatarios = new FormControl('');
  transferenciaATercerosForm: FormGroup = new FormGroup({});

  // Variables proceso de transferencia
  //pasosTransferencia: boolean | undefined;
  ingresarDatos = false;
  confirmarDatos = false;
  transferenciaARealizar = false;
  btnContinuar = true;
  btnConfirmar = true;


  destinatarioATransferir: any[] = [];
  destinatarioATransferirSeleccionado: any;
  selectedId: any = null;
  // tablaDestinatarios = true;
  buscadorDestinatarios = true;

  offcanvasRef: any;

  // Variables para input monto
  // Variables para saldos
  error1: boolean = false;
  error2: boolean = false;
  montoValido: boolean = false;
  cupoCtaCte: any;
  montoATransferir: any;

  emailInicialmenteValido = false;

  continuarTransferencia = false;

  inputErrorVacioEmail: any;
  inputValidoEmail: any;

  transferenciaOk: boolean = true;
  tranferenciaError: boolean = false;

  datosTransaccion: any;
  
  nombreDestinatario: any;

  modalTransferenciaInstance: any;

  pasosTransferencia: boolean = false;

  alertaAyuda: boolean = true;

  constructor(
    public agendaService: AgendaDestinatariosService,
    public productosUsuarioService: ProductosUsuarioService,
    public formatoEmailService: FormatoEmailService,
    private cdRef: ChangeDetectorRef,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private backdropService: BackdropService,
  ) { 
    this.destinatarioSeleccionado = { id: null, nombre: '' };
    
  }

  ngOnInit(): void {
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

    let control = this.transferenciaATercerosForm.get('emailDestinatario');
    if (control) {
      control.disable();
    }

    this.backdropSubscription = this.backdropService.mostrarBackdropCustomModal$.subscribe(
      mostrar => this.mostrarBackdropCustomModal = mostrar
    );

    
    // Obtén los destinatarios al inicializar el componente
    this.agendaService.getDestinatarios().subscribe(data => {
      this.destinatarios = data;
      this.totalPages = this.destinatarios ? Math.ceil(this.destinatarios.length / this.itemsPerPage) : 0;
      this.ordenarDatos('nombre');
      this.cdRef.detectChanges();
    });

    this.busquedaDestinatarios.valueChanges
      .pipe(
        switchMap(valorBusqueda => valorBusqueda ? this.agendaService.filtrarDestinatarios(valorBusqueda) : of([]))
      )
    .subscribe(datosFiltrados => {
      this.destinatarios = datosFiltrados;
      this.totalPages = this.destinatarios ? Math.ceil(this.destinatarios.length / this.itemsPerPage) : 0;
      this.cdRef.detectChanges();
    });

    // Aplica pipe pesos
    this.transferenciaATercerosForm.controls['montoATransferir'].valueChanges.subscribe((value) => {
      const transformedValue = this.pesosPipe.transform(value);
      this.transferenciaATercerosForm.controls['montoATransferir'].setValue(transformedValue, {emitEvent: false});
    });    
  }

  ngOnDestroy(): void {
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
        this.backdropService.show();  // Muestra el backdrop
      });
      el.addEventListener('hide.bs.modal', () => {
        this.backdropService.hide();  // Oculta el backdrop
      });
      return modal;
    });

    this.subscription = this.agendaService.getDatosNuevoDestinatario().subscribe(datos => {
      this.datosCapturados = datos;
      this.abrirModalNuevoDestinatario();
    });

    // Suscripción a getDatosNuevoDestinatario
    this.agendaService.getDatosNuevoDestinatario().subscribe(datos => {
      this.datosNuevoDestinatario = datos;
      console.log('Datos del nuevo destinatario capturados:', this.datosNuevoDestinatario);
    });

    const controlMontoATransferir = this.transferenciaATercerosForm.get('montoATransferir');
    if (controlMontoATransferir) {
      controlMontoATransferir.valueChanges.subscribe(() => {
        this.validaDatosTransferencia();
      });
    }

    const controlEmailDestinatario = this.transferenciaATercerosForm.get('emailDestinatario');
    if (controlEmailDestinatario) {
      controlEmailDestinatario.valueChanges.subscribe(() => {
        this.validaDatosTransferencia();
      });
    }

    this.getDatosCuentaCorriente(0);

    
  }

  ocultaMensaje() {
    console.log('El botón en el componente app-alertas fue clickeado');
    this.alertaAyuda = false;
  }
  

  // Captura datos de cuenta corriente
  getDatosCuentaCorriente(_id: any): void {
    this.productosUsuarioService.getProductosUsuarioResumen(_id).subscribe(
      data => {
        this.productosUsuario = data.productos ? { productos: data.productos } : { productos: []};
        this.cupoCtaCte = parseFloat(this.productosUsuario.productos[0]?.transacciones[this.productosUsuario.productos[0]?.transacciones.length - 1]?.saldo);
      }
    );
  }

  seleccionarDestinatario(id: any): void {
    this.destinatarioSeleccionado = { id: id };
    this.getDatosCuentaCorriente(0);
    this.destinatarioId = id;
    this.selectedId = id;
    this.pasosTransferencia = true;
    this.ingresarDatos = true;
    this.mostrarPaginador = false;
    // this.tablaDestinatarios = false;
    this.buscadorDestinatarios = false;
    this.destinatarioSeleccionadoTabla = true;
    /*if (this.tablaDestinatarioSeleccionado && this.tablaDestinatarioSeleccionado.nativeElement) {
      this.tablaDestinatarioSeleccionado.nativeElement.classList.add('paso-ok');
    }*/
  
    // Encuentra el destinatario seleccionado en la lista de destinatarios
    this.destinatarioATransferirSeleccionado = this.destinatarios.find(destinatario => destinatario.id === id);
  
    // Si no se encontró un destinatario con el ID dado, selecciona el último destinatario
    if (!this.destinatarioATransferirSeleccionado) {
      this.destinatarioATransferirSeleccionado = this.destinatarios[this.destinatarios.length - 1];
    }
  
    // Llama a getClassForDestinatario con el ID del destinatario seleccionado
    this.getClassForDestinatario(this.destinatarioATransferirSeleccionado.id);
  
    // Imprime los datos del destinatario seleccionado en la consola
    this.destinatarioATransferirSeleccionado = this.destinatarios.find(destinatario => destinatario.id === id);

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

  vaciarEmailDestinatario() {
    let control = this.transferenciaATercerosForm.controls['emailDestinatario'];
    control.enable(); // Habilita el control
    control.setValue(''); // Establece el valor del control en vacío
    this.inputValidoEmail = false; // Establece inputValidoEmail en false
    this.validaEmail('emailDestinatario'); // Valida el email después de vaciarlo
    this.validaDatosTransferencia(); // Verifica las condiciones después de vaciar el email
  }

  validaMontoATransferir(): void {
    const controlMontoATransferir = this.transferenciaATercerosForm.get('montoATransferir');
  
    if (controlMontoATransferir) {
      let montoATransferir = controlMontoATransferir.value; // Modificado
  
      // Convertir el valor del input a número
      montoATransferir = montoATransferir.replace(/\$|\.| /g, '');
      const numericInputMonto = Number(montoATransferir);
  
      // Validación 1
      if (numericInputMonto === 0 || !numericInputMonto) {
        this.error1 = true;
        console.log('valor 0 o vacío');
      } 
      
      else if (numericInputMonto <= this.cupoCtaCte) {
        this.montoValido = true;
        console.log('valido');
      }
      
      else if (numericInputMonto > this.cupoCtaCte) {
        this.error2 = true;
        console.log('valor superior');
      }
    }
    this.validaDatosTransferencia();
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

  botonCancelarTransferencia(): void {
    this.pasosTransferencia = false;
    this.ingresarDatos = false;
    this.confirmarDatos = false;
    this.transferenciaARealizar = false;
    this.destinatarioSeleccionadoTabla = false;
    this.destinatarioSeleccionado = { id: null, nombre: undefined };
    this.agendaService.getDestinatarios().subscribe(data => {
      // Hacer una copia de los datos
      this.destinatarios = [...data];
      this.ordenarDatos('nombre');
      this.paginatedDestinatarios = this.destinatarios.slice(0, this.itemsPerPage).map(destinatario => ({
        ...destinatario,
        selected: false
      }));
      this.totalPages = this.destinatarios ? Math.ceil(this.destinatarios.length / this.itemsPerPage) : 0;
      this.cdRef.detectChanges();
    });
    this.selectedId = null;
    // this.tablaDestinatarios = true;
    this.buscadorDestinatarios = true;
    this.cdRef.detectChanges();

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

  getClassForDestinatario(destinatarioId: number): string {
    if (destinatarioId === this.selectedId) {
      return 'seleccionado';
    } else if (this.selectedId !== null && destinatarioId !== this.selectedId) {
      return 'oculto';
    } else {
      return '';
    }
  }

  cambiarDestinatario(): void {
    this.pasosTransferencia = false;
    this.ingresarDatos = false;
    this.confirmarDatos = false;
    this.transferenciaARealizar = false;
    this.destinatarioSeleccionadoTabla = false;
    this.destinatarioSeleccionado = { id: null, nombre: undefined };
    this.agendaService.getDestinatarios().subscribe(data => {
      // Hacer una copia de los datos
      this.destinatarios = [...data];
      this.ordenarDatos('nombre');
      this.paginatedDestinatarios = this.destinatarios.slice(0, this.itemsPerPage).map(destinatario => ({
        ...destinatario,
        selected: false
      }));
      this.totalPages = this.destinatarios ? Math.ceil(this.destinatarios.length / this.itemsPerPage) : 0;
      this.cdRef.detectChanges();
    });
    this.selectedId = null;
    // this.tablaDestinatarios = true;
    this.buscadorDestinatarios = true;
    this.cdRef.detectChanges();

    // Cierra el modal y oculta el backdrop-custom
    const modalCambiosDestinatario = this.modales.find(modal => modal._element.id === 'modalCambiosDestinatario');
    if (modalCambiosDestinatario) {
      modalCambiosDestinatario.hide();
    }
    this.mostrarBackdropCustomModal = false;
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

  datosDestinarioId(id: any): void {
    this.agendaService.actualizarIdDestinatarioAeditar(id);
  } 

  // Solo permite ingresar números en los campos de texto
  soloNumeros(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  
  // Anima icono de TH
  public onHeaderClick(): void {
    this.isRotatedIn = !this.isRotatedIn;
  }

  // Ordena los datos de la tabla
  ordenarDatos(column: string): void {
    this.columnaSeleccionada = column;
    if (this.sortedColumn === column) {
      this.sortOrder = this.sortOrder === 1 ? -1 : 1;
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortedColumn = column;
      this.sortAscending = column === 'nombre' ? true : false;
    }
    this.sortOrder = this.sortAscending ? 1 : -1;
    this.destinatarios?.sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {
      return a[column] > b[column] ? this.sortOrder : a[column] < b[column] ? -this.sortOrder : 0;
    });
  
    this.destinatarios?.sort((a: { [x: string]: string; }, b: { [x: string]: string; }) => {
      return a[column].localeCompare(b[column]) * this.sortOrder;
    });
  
    this.datosOrdenados.emit();
  }

  // Logica para nuevo destinatario

  abrirOffcanvas(): void {
    this.mostrarBackdropCustomOffcanvas.emit(true);
    this.mostrarBackdropCustomOffcanvasEstado = true;
  }
  
  // Modal para nuevo destinatario
  abrirModalNuevoDestinatario(): void {
    var modalNuevoDestinatario = new bootstrap.Modal(document.getElementById('modalNuevoDestinatario'), {});
    modalNuevoDestinatario.show();
    this.backdropService.show();
  
    // Indica que se están enviando los datos
    this.enviandoNuevoDestinatario = true;
  
   // Envía los datos al servicio
    this.agendaService.guardarNuevoDestinatario(this.datosCapturados).subscribe(nuevoDestinatario => {

      //this.offcanvasHidden = true;
      // Espera al menos 2 segundos antes de indicar que los datos se han guardado correctamente
      setTimeout(() => {
        this.enviandoNuevoDestinatario = false;
        this.datosGuardadosNuevoDestinatario = true;
        this.backdropService.hide();
      }, 2000);

      // Ensure destinatarios is an array before pushing
      if (!this.destinatarios) {
        this.destinatarios = [];
      }
      this.destinatarios.push(nuevoDestinatario);

      // Ordena los destinatarios por nombre en orden ascendente
      this.destinatarios = this.destinatarios?.sort((a, b) => {
        if (a.nombre && b.nombre) {
          return a.nombre.localeCompare(b.nombre);
        } else {
          return 0;
        }
      });

      // Forzar la actualización de los datos en la tabla
      this.destinatarios = [...this.destinatarios];

      // Forzar la detección de cambios
      this.cdr.detectChanges();

      this.agendaService.nuevoDestinatarioGuardado.next();
    }, _error => {
      // Espera al menos 2 segundos antes de indicar que ha habido un error
      setTimeout(() => {
        this.enviandoNuevoDestinatario = false;
        this.errorServerNuevoDestinatario = true;
      }, 2000);
    });
  }

  // Advertencia cambio de destinatario
  abrirModalCambioDestinatario(): void {
    var modalCambiosDestinatario = new bootstrap.Modal(document.getElementById('modalCambiosDestinatario'), {});
    modalCambiosDestinatario.show();
  }

  abrirModalCancelarTransferencia(): void {
    var modalCancelarTransferencia = new bootstrap.Modal(document.getElementById('modalCancelarTransferencia'), {});
    modalCancelarTransferencia.show();
  }

  // Nueva función para cerrar el modal y seleccionar el nuevo destinatario
  cambiarANuevoDestinatarios(): void {
    this.agendaService.getDestinatarios().subscribe(data => {
      // Hacer una copia de los datos
      this.destinatarios = [...data];
      this.paginatedDestinatarios = this.destinatarios.slice(0, this.itemsPerPage).map(destinatario => ({
        ...destinatario,
      }));
      this.totalPages = this.destinatarios ? Math.ceil(this.destinatarios.length / this.itemsPerPage) : 0;
      console.log('Tabla actualizada:', this.destinatarios);
  
      // Guarda el último destinatario en la variable 'destinatarioId'
      this.destinatarioId = this.destinatarios[this.destinatarios.length - 1];
  
      // Activa la función 'seleccionarDestinatario' con el último destinatario
      this.seleccionarDestinatario(this.destinatarioId);
  
      this.cdRef.detectChanges();
    });
  }

  calculoTransferencia(): any {
    let montoATransferir: any = this.transferenciaATercerosForm.get('montoATransferir')?.value;
    montoATransferir = montoATransferir.replace(/\D/g, ''); // Asegúrate de que sea un número
  
    // Resta montoATransferir a cupoCtaCte
    this.cupoCtaCte -= montoATransferir;
  
    const montoATransferirString = montoATransferir.toString();
    return {
      montoTransferido: montoATransferirString,
      cupoCtaCte: this.cupoCtaCte,
      montoParaTransferencia: montoATransferir
    };
  }
  
  realizarTransferencia(): Observable<any> {
    
    // Obtén los datos del destinatario
    this.agendaService.getDestinatarioPorId(this.destinatarioId).subscribe(destinatario => {
      this.agendaService.getDestinatarios();
    });
  
    // Llama al metodo calculo y obtiene los valores
    const result = this.calculoTransferencia();
    
    // Obtener la fecha
    const datePipe = new DatePipe('en-US');
    const fecha = new Date();
    const fechaFormateada = datePipe.transform(fecha, 'yyyy-MM-dd');
    
    let montoTransferido = result.montoTransferido;
    let cupoCtaCte = result.cupoCtaCte;
    
    // Hacer una petición GET para obtener los datos del archivo productos-usuario.json
    //return from(this.http.get('http://localhost:3000/backend/data/productos-usuario.json').toPromise()).pipe(
    return from(this.http.get(this.baseUrl + '/backend/data/productos-usuario.json').toPromise()).pipe(
      tap(() => console.log('La petición HTTP se ha realizado')),
      map((res: any) => {
        console.log('La petición HTTP ha devuelto una respuesta');

        // Los datos del archivo están en 'res'
        const datosTransferencia = res;
        let productoCtaCte = datosTransferencia.productos.find((producto: { id: string; }) => producto.id === "0");

        // Si productoCtaCte es undefined, inicialízalo como un objeto con una propiedad transacciones que es un array vacío
        if (!productoCtaCte) {
          productoCtaCte = { id: "0", transacciones: [] };
        }

        // Convertir 'montoPagado', 'cupoLineaCredito' y 'cupoDisponibleLineaCredito' a strings
        const cupoCtaCteString = cupoCtaCte.toString();

        // Ahora puedes estar seguro de que productoCtaCte está definido
        productoCtaCte.cupo = cupoCtaCteString;

        // Obtener el último ID en el array de transacciones
        const ultimoIdTransaccion = Math.max(...productoCtaCte.transacciones.map((t: { id: string; }) => parseInt(t.id)), 0);

        // Generar un nuevo ID que sea el siguiente al último ID existente
        const nuevoIdTransaccion = ultimoIdTransaccion + 1;

        productoCtaCte.transacciones.push({
          id: nuevoIdTransaccion.toString(),
          fecha: fechaFormateada,
          destinatario: this.nombreDestinatario,
          detalle: `Transferencia a ${this.nombreDestinatario}`,
          mensaje: this.transferenciaATercerosForm.get('mensaje')?.value,
          cargo: montoTransferido,
          abono: '',
          saldo: '' // Reemplaza con el valor real
        });

        // Imprimir la estructura de datos enviadas en la consola
        console.log('Datos de transferencia desde componente:', datosTransferencia);
        return JSON.stringify(datosTransferencia);

        
      }),
      catchError(error => {
        console.error('Ha ocurrido un error:', error);
        // Establecer tranferenciaError a true para mostrar el div de error
        this.transferenciaOk = false;
        this.tranferenciaError = true;
        return throwError(error);
      })
    );
  }

  abrirModalTransferencia(): void {
    var modalTransferencia = new bootstrap.Modal(document.getElementById('modalTransferencia'), {});
    modalTransferencia.show();
    this.realizarTransferencia().subscribe(datosTransferencia => {
      this.productosUsuarioService.getDatosTransferencia(datosTransferencia);
      of(null).pipe(
        delay(1500)
      ).subscribe(() => this.backdropService.hide());
    });
  }

  resetearFormulario(): void {
    // Restablecer todas las variables a sus valores iniciales
    this.pasosTransferencia = false;
    this.agendaService.getDestinatarios().subscribe(data => {
      // Hacer una copia de los datos
      this.destinatarios = [...data];
      this.destinatarios.sort((a, b) => a.nombre.localeCompare(b.nombre));
      this.paginatedDestinatarios = this.destinatarios.slice(0, this.itemsPerPage).map(destinatario => ({
        ...destinatario,
        selected: false
      }));
      this.totalPages = this.destinatarios ? Math.ceil(this.destinatarios.length / this.itemsPerPage) : 0;
      this.cdRef.detectChanges();
    });
    this.selectedId = null;
    // this.tablaDestinatarios = true;
    this.buscadorDestinatarios = true;
    this.cdRef.detectChanges();

    // Restablecer el formulario
    this.transferenciaATercerosForm.reset({
      montoATransferir: 'Ingresa el monto a transferir',
      mensaje: '',
      emailDestinatario: ''
    });

    this.cdr.detectChanges();

  }

  ocultaBackDrop(): void {
    this.backdropService.hide();
  }
}
