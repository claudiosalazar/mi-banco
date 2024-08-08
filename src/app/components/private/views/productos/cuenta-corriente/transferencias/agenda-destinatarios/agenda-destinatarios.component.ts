import { Component, ElementRef, EventEmitter, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AgendaService } from '../../../../../../../services/agenda.service';
import { BackdropService } from '../../../../../../../services/backdrop.service';
import { FormControl } from '@angular/forms';
import { of, Subscription, switchMap } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';

declare var bootstrap: any;

@Component({
  selector: 'app-agenda-destinatarios',
  templateUrl: './agenda-destinatarios.component.html',
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
export class AgendaDestinatariosComponent implements OnInit, OnDestroy {

  @ViewChild('crearDestinatarioCanvas', { static: false }) crearDestinatarioCanvas: ElementRef | undefined;
  @ViewChild('editarDestinatarioCanvas') editarDestinatarioCanvas: ElementRef | undefined;
  @ViewChild('modalEliminarDestinatario') modalEliminarDestinatario: ElementRef | undefined;
  @ViewChild('modalNuevoDestinatario') modalNuevoDestinatario: ElementRef | undefined;
  @ViewChild('modalEdicionDestinatario') modalEdicionDestinatario: ElementRef | undefined;

  private backdropSubscription: Subscription | undefined;
  private subscription: Subscription | undefined;
  public columnaSeleccionada: string | undefined;
  public isRotatedIn: boolean = false;
  mostrarBackdropCustomModal = false;
  modales: any[] = [];
  mostrarBackdropCustomOffcanvas = new EventEmitter<boolean>();
  mostrarBackdropCustomOffcanvasEstado: boolean = false;
  usuarioEliminado = false;
  errorServer = false;

  agenda: any[] = [];
  paginatedAgenda: any[] = [];
  
  // Variables para ordenar datos de tabla
  sortOrder = 1;
  sortedColumn: any;
  sortAscending: boolean = true;

  originalData: any[] = [];
  itemsPerPage = 5;
  currentPage = 1;
  paginatedData: any[] = [];
  totalPages: any;
  id: number | undefined;

  busquedaDestinatarios = new FormControl('');
  datosOrdenados = new EventEmitter<void>();

  enviandoDestinatarioEditado: boolean = true;
  datosGuardadosDestinatarioEditado: boolean = false;
  errorServerDestinatarioEditado: boolean = false;

  constructor(
    private agendaService: AgendaService,
    private cdr: ChangeDetectorRef,
    private backdropService: BackdropService
  ) { }

  ngOnInit() {
    this.loadData();

    this.busquedaDestinatarios.valueChanges
    .pipe(
      switchMap(valorBusqueda => {
        if (valorBusqueda) {
          return this.agendaService.filtrarAgenda(valorBusqueda);
        } else {
          // Resetear a los datos originales y la página a 1
          this.currentPage = 1;
          this.agenda = [...this.originalData];
          this.paginarAgenda();
          this.cdr.detectChanges();
          return of(this.originalData);
        }
      })
    )
    .subscribe(datosFiltrados => {
      this.agenda = datosFiltrados;
      this.totalPages = this.agenda ? Math.ceil(this.agenda.length / this.itemsPerPage) : 0;
      this.paginarAgenda();
      this.cdr.detectChanges();
    });

    this.mostrarBackdropCustomOffcanvas.subscribe(valor => {
      this.mostrarBackdropCustomOffcanvasEstado = valor;
    });

    this.backdropSubscription = this.backdropService.mostrarBackdropCustomModal$.subscribe(
      mostrar => this.mostrarBackdropCustomModal = mostrar
    );
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
        this.backdropService.show();  // Muestra el backdrop
      });
      el.addEventListener('hide.bs.modal', () => {
        this.backdropService.hide();  // Oculta el backdrop
      });
      return modal;
    });

    /*this.subscription = this.agendaService.getDatosNuevoDestinatario().subscribe(datos => {
      this.datosCapturados = datos;
      this.abrirModalNuevoDestinatario();
    });*/

  }

  loadData(): void {
    this.agendaService.getAgenda().subscribe((agenda: any) => {
      this.agenda = agenda;
      this.originalData = [...this.agenda];
      this.paginarAgenda();
      this.cdr.detectChanges();
    });
  }

  public onHeaderClick(): void {
    this.isRotatedIn = !this.isRotatedIn;
    this.cdr.detectChanges();
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
  
    this.agenda?.sort((a: { [x: string]: number; }, b: { [x: string]: number; }) => {
      return a[column] > b[column] ? this.sortOrder : a[column] < b[column] ? -this.sortOrder : 0;
    });
    this.paginarAgenda();
    this.datosOrdenados.emit();
    this.cdr.detectChanges();
  }

  paginarAgenda(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedAgenda = this.agenda.slice(start, end);
    this.totalPages = Math.ceil(this.agenda.length / this.itemsPerPage);
    this.cdr.detectChanges();
  }

  handleDatosFiltrados(datosFiltrados: any[]) {
    const datosFiltradosPorProducto = datosFiltrados.filter(transaccion => transaccion.id_producto === 1);
    this.agenda = datosFiltradosPorProducto;
    this.originalData = [...this.agenda];
    this.agendaService.actualizarDatosFiltrados(datosFiltradosPorProducto);
  }

  abrirModalEliminar(id: number): void {
    this.id = id;
    console.log(this.id);
    var modalEliminarDestinatario = new bootstrap.Modal(document.getElementById('modalEliminarDestinatario'), {});
    modalEliminarDestinatario.show();
    this.backdropService.show();
  }

  abrirOffcanvas(): void {
    this.mostrarBackdropCustomOffcanvas.emit(true);
    this.mostrarBackdropCustomOffcanvasEstado = true;
  }

  abrirOffcanvasEdicion(id: number): void {
    this.mostrarBackdropCustomOffcanvas.emit(true);
    this.mostrarBackdropCustomOffcanvasEstado = true;
    
    // Aquí puedes enviar el ID al componente 'editar-destinatario'
    // Supongamos que tienes un servicio para compartir datos entre componentes
    this.agendaService.setId(id);
  }

  abrirModalEdicionDestinatario(): void {
    var modalEdicionDestinatario = new bootstrap.Modal(document.getElementById('modalEdicionDestinatario'), {});
    modalEdicionDestinatario.show();
    this.backdropService.show();
  }
  
  ocultaBackDrop(): void {
    this.backdropService.hide();
  }

}