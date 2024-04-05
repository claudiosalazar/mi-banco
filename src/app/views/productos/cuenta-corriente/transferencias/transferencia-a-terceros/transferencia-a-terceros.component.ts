import { Component, OnInit, ElementRef, ViewChild, OnDestroy, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AgendaDestinatariosService } from '../../../../../core/services/agenda-destinatarios.service';
import { Subscription, of } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { catchError, switchMap } from 'rxjs/operators';

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
  @ViewChild('crearDestinatarioCanvas') crearDestinatarioCanvas: ElementRef | undefined;
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

  //destinatarios: { [key: string]: any }[] | undefined;
  destinatarioSeleccionado: { id: any } | undefined;
  destinatarioId: string | null | undefined;

  destinatarios: any[] = [];
  paginatedDestinatarios: any[] = [];

  private subscription: Subscription | undefined;

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
  transferenciaATerceros: FormGroup = new FormGroup({});

  // Variables proceso de transferencia
  pasosTransferencia = false;
  ingresarDatos = true;
  confirmarDatos = false;
  realizarTransferencia = false;
  destinatarioATransferir: any[] = [];
  destinatarioATransferirSeleccionado: any;
  selectedId: any = null;
  tablaDestinatarios = true;
  buscadorDestinatarios = true;


  offcanvasRef: any;

  constructor(
    public agendaService: AgendaDestinatariosService,
    private cdRef: ChangeDetectorRef,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.transferenciaATerceros = new FormGroup({
      destinatarioATransferir: new FormControl({value: ''}),
      destinatarioSeleccionado: new FormControl({value: ''}),
      montoATransferir: new FormControl({value: ''}),
      mensaje: new FormControl({value: ''}),
      emailDestinatario: new FormControl({value: ''}),
      montoATransferirOk: new FormControl({value: ''}),
      mensajeOk: new FormControl({value: ''}),
      emailDestinatarioOk: new FormControl({value: ''}),
    });
    
    // Obtén los destinatarios al inicializar el componente
    this.agendaService.getDestinatarios().subscribe(data => {
      this.destinatarios = data;
      this.totalPages = this.destinatarios ? Math.ceil(this.destinatarios.length / this.itemsPerPage) : 0;
      this.ordenarDatos('nombre');
      this.cdRef.detectChanges();
    });

    this.busquedaDestinatarios.valueChanges
    .pipe(
      switchMap(valorBusqueda => this.agendaService.filtrarDestinatarios(valorBusqueda))
    )
    .subscribe(datosFiltrados => {
      this.destinatarios = datosFiltrados;
      this.totalPages = this.destinatarios ? Math.ceil(this.destinatarios.length / this.itemsPerPage) : 0;
      this.cdRef.detectChanges();
    });

  }

  ngAfterViewInit(_e: Event): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const backdropModal = document.querySelector('.modal-backdrop.fade.show');
          if (backdropModal && backdropModal.parentNode) {
            backdropModal.parentNode.removeChild(backdropModal);
          }
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  
    this.subscription = this.agendaService.getDatosNuevoDestinatario().subscribe(datos => {
      this.datosCapturados = datos;
      this.abrirModalNuevoDestinatario();
    });
  
    this.modales = Array.from(document.querySelectorAll('.modal')).map(el => {
      const modal = new bootstrap.Modal(el);
      el.addEventListener('show.bs.modal', () => {
        this.mostrarBackdropCustomModal = true;
      });
      el.addEventListener('hide.bs.modal', () => {
        this.mostrarBackdropCustomModal = false;
      });
      return modal;
    });
  
    // Agrega el modal 'modalCambiosDestinatario' a la lista de modales
    const modalCambiosDestinatario = document.getElementById('modalCambiosDestinatario');
    if (modalCambiosDestinatario) {
      const modal = new bootstrap.Modal(modalCambiosDestinatario);
      modalCambiosDestinatario.addEventListener('show.bs.modal', () => {
        this.mostrarBackdropCustomModal = true;
      });
      modalCambiosDestinatario.addEventListener('hide.bs.modal', () => {
        this.mostrarBackdropCustomModal = false;
      });
      this.modales.push(modal);
    }

    // Suscripción a getDatosNuevoDestinatario
    this.agendaService.getDatosNuevoDestinatario().subscribe(datos => {
      this.datosNuevoDestinatario = datos;
      console.log('Datos del nuevo destinatario capturados:', this.datosNuevoDestinatario);
    });
  }

  seleccionarDestinatario(id: any): void {
    this.destinatarioId = id;
    this.selectedId = id;
    this.pasosTransferencia = true;
    this.mostrarPaginador = false;
    this.tablaDestinatarios = false;
    this.buscadorDestinatarios = false;
  
    // Encuentra el destinatario seleccionado en la lista de destinatarios
    this.destinatarioATransferirSeleccionado = this.destinatarios.find(destinatario => destinatario.id === id);
  
    // Si no se encontró un destinatario con el ID dado, selecciona el último destinatario
    if (!this.destinatarioATransferirSeleccionado) {
      this.destinatarioATransferirSeleccionado = this.destinatarios[this.destinatarios.length - 1];
    }
  
    // Llama a getClassForDestinatario con el ID del destinatario seleccionado
    this.getClassForDestinatario(this.destinatarioATransferirSeleccionado.id);
  
    // Imprime los datos del destinatario seleccionado en la consola
    console.log('Selecionado:', this.destinatarioATransferirSeleccionado);
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
    this.tablaDestinatarios = true;
    this.buscadorDestinatarios = true;
    this.cdRef.detectChanges();

    // Cierra el modal y oculta el backdrop-custom
    const modalCambiosDestinatario = this.modales.find(modal => modal._element.id === 'modalCambiosDestinatario');
    if (modalCambiosDestinatario) {
      modalCambiosDestinatario.hide();
    }
    this.mostrarBackdropCustomModal = false;
  }

  datosDestinarioId(id: any): void {
    console.log('ID del usuario:', id);
    // Actualiza el ID del destinatario a editar en el servicio
    this.agendaService.actualizarIdDestinatarioAeditar(id);
  }

  ngOnDestroy(): void {
    // Es importante cancelar la suscripción para evitar fugas de memoria
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
  
    // Indica que se están enviando los datos
    this.enviandoNuevoDestinatario = true;
  
   // Envía los datos al servicio
    this.agendaService.guardarNuevoDestinatario(this.datosCapturados).subscribe(nuevoDestinatario => {

      //this.offcanvasHidden = true;
      // Espera al menos 2 segundos antes de indicar que los datos se han guardado correctamente
      setTimeout(() => {
        this.enviandoNuevoDestinatario = false;
        this.datosGuardadosNuevoDestinatario = true;
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
    }, error => {
      // Espera al menos 2 segundos antes de indicar que ha habido un error
      setTimeout(() => {
        this.enviandoNuevoDestinatario = false;
        this.errorServerNuevoDestinatario = true;
      }, 2000);
    });
  }

  // Advertencia cambio de destinatario
  abrirModalCambioDestinatario(): void {
    // Encuentra el modal 'modalCambiosDestinatario' en la lista de modales y lo muestra
    const modalCambiosDestinatario = this.modales.find(modal => modal._element.id === 'modalCambiosDestinatario');
    if (modalCambiosDestinatario) {
      modalCambiosDestinatario.show();
    } else {
      console.error('No se encontró el modal con ID "modalCambiosDestinatario". Asegúrate de que el ID del modal en el HTML coincide con el ID en el método "abrirModalCambioDestinatario".');
    }
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

}
