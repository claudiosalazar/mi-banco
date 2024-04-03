import { Component, OnInit, ElementRef, ViewChild, OnDestroy, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AgendaDestinatariosService } from '../../../../../core/services/agenda-destinatarios.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

declare var bootstrap: any;

@Component({
  selector: 'app-transferencia-a-terceros',
  templateUrl: './transferencia-a-terceros.component.html'
})
export class TransferenciaATercerosComponent implements OnInit, OnDestroy{

  @ViewChild('modalNuevoDestinatario') modalNuevoDestinatario: ElementRef | undefined;
  @ViewChild('modalEdicionDestinatario') modalEdicionDestinatario: ElementRef | undefined;
  @ViewChild('crearDestinatarioCanvas') crearDestinatarioCanvas: ElementRef | undefined;
  @ViewChild('editarDestinatarioCanvas') editarDestinatarioCanvas: ElementRef | undefined;
  @Output() datosOrdenados = new EventEmitter<void>();

  //destinatarios: { [key: string]: any }[] | undefined;
  destinatarioSeleccionado: { id: any } | undefined;
  destinatarioId: string | undefined;

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

  constructor(
    private agendaService: AgendaDestinatariosService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.transferenciaATerceros = new FormGroup({
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

  seleccionarDestinatario(id: any): void {
    this.destinatarioId = id;
    this.pasosTransferencia = true;
    this.mostrarPaginador = false;

    // Encuentra el destinatario seleccionado en la lista de destinatarios
    this.destinatarioATransferirSeleccionado = this.destinatarios.find(destinatario => destinatario.id === id);

    // Imprime los datos del destinatario seleccionado en la consola
    console.log(this.destinatarioATransferirSeleccionado);
  }

  ngAfterViewInit(_e: Event): void {

    // Elmina backdrop de offcanvas y modal
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const backdropModal = document.querySelector('.modal-backdrop.fade.show');
          if (backdropModal && backdropModal.parentNode) {
            backdropModal.parentNode.removeChild(backdropModal);
            // console.log('El backdrop ha sido eliminado');
          }
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });

    this.subscription = this.agendaService.getDatosNuevoDestinatario().subscribe(datos => {
      // Aquí puedes manejar los datos recibidos
      this.datosCapturados = datos;
    });

    // Suscríbete a getDatosEditadosDestinatario
    this.subscription = this.agendaService.getDatosEditadosDestinatario().subscribe(datos => {
      // Aquí puedes manejar los datos recibidos
      this.datosCapturados = datos;
      console.log('Datos editados del destinatario:', this.datosCapturados);
    });
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
      this.sortAscending = true;
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

    
}
