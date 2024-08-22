import { Component, OnInit, ElementRef, ViewChild, OnDestroy, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { AgendaService } from '../../../../../../../services/agenda.service';
import { BackdropService } from '../../../../../../../services/backdrop.service';
import { FormControl } from '@angular/forms';
import { distinctUntilChanged, of, Subscription, switchMap } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Agenda } from '../../../../../../../models/agenda.model';

declare var bootstrap: any;

@Component({
  selector: 'mb-agenda-destinatarios',
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

  @ViewChild('crearDestinatarioCanvas') crearDestinatarioCanvas: ElementRef | undefined;
  @ViewChild('editarDestinatarioCanvas') editarDestinatarioCanvas: ElementRef | undefined;
  @ViewChild('modalEliminarDestinatario') modalEliminarDestinatario: ElementRef | undefined;
  @ViewChild('modalNuevoDestinatario') modalNuevoDestinatario: ElementRef | undefined;
  @ViewChild('modalEdicionDestinatario') modalEdicionDestinatario: ElementRef | undefined;

  private backdropSubscription: Subscription | undefined;
  private subscriptions: Subscription = new Subscription();
  public columnaSeleccionada: string | undefined;
  public isRotatedIn: boolean = false;

  modales: any[] = [];
  mostrarBackdropCustomOffcanvas = new EventEmitter<boolean>();
  mostrarBackdropCustomOffcanvasEstado: boolean = false;
  
  renderizarAgregarDestinatario = new EventEmitter<boolean>();
  renderizarAgregarDestinatarioEstado = false;
  
  mostrarBackdropCustomModal = new EventEmitter<boolean>();
  mostrarBackdropCustomModalEstado = false;

  usuarioEliminado = false;
  errorServer = false;

  agenda: any[] = [];
  paginatedAgenda: any[] = [];
  
  // Variables para ordenar datos de tabla
  sortOrder = 1;
  sortedColumn: any;
  sortAscending: boolean = true;

  originalData: any[] = [];
  itemsPerPage: any;
  currentPage = 1;
  paginatedData: any[] = [];
  totalPages: any;
  id_agenda: any | undefined;
  nombre: string | undefined;

  busquedaDestinatarios = new FormControl('');
  datosOrdenados = new EventEmitter<void>();

  // Variables para modal nuevo destinatario
  datosNuevoDestinatario: any;
  enviandoNuevoDestinatario: boolean = true;
  datosGuardadosNuevoDestinatario: boolean = false;
  errorServerNuevoDestinatario: boolean = false;
  datosCapturados: any;

  enviandoDestinatarioEditado: boolean = true;
  datosGuardadosDestinatarioEditado: boolean = false;
  errorServerDestinatarioEditado: boolean = false;

  destinatarioEliminado: boolean = false;
  consultaEliminacionDestinatario: boolean = true;

  tablaConDatos: boolean = true;
  mostrarAlerta: boolean = false;

  cambios: any;
  datosEditados: any;

  idUserNumber: number | undefined;

  constructor(
    private agendaService: AgendaService,
    private cdr: ChangeDetectorRef,
    private backdropService: BackdropService
  ) { }

  ngOnInit() {
    this.loadData();
  
    this.mostrarBackdropCustomOffcanvas.subscribe(valor => {
      this.mostrarBackdropCustomOffcanvasEstado = valor;
    });
  
    this.renderizarAgregarDestinatario.subscribe(valor => {
      this.renderizarAgregarDestinatarioEstado = valor;
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
      this.cdr.detectChanges(); // Forzar la detección de cambios después de actualizar los datos filtrados
    });
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
  
    this.subscriptions.add(
      this.agendaService.destinatarioAgregado$.subscribe(() => {
        this.loadData();
      })
    );
  
    this.subscriptions = this.agendaService.destinatarioActualizado$.subscribe((datosEditados: any) => {
      this.abrirModalEdicion();
      this.loadData();
    });
  
    this.subscriptions.add(
      this.agendaService.getDatosNuevoDestinatario().subscribe(datos => {
        this.datosCapturados = datos;
        this.abrirModalNuevoDestinatario();
      })
    );
  }
  
  loadData() {
    // Obtener el idUserNumber desde el almacenamiento
    const idUser = localStorage.getItem('id_user'); // O sessionStorage.getItem('id_user')
    if (idUser) {
      const idUserNumber = parseInt(idUser, 10);
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
    if (this.agenda.length >= 1) {
      this.tablaConDatos = true;
      this.mostrarAlerta = false;
    } else {
      this.tablaConDatos = false;
      this.mostrarAlerta = true;
    }
    this.cdr.detectChanges(); // Forzar la detección de cambios después de actualizar la agenda
  }

  ngOnDestroy(): void {
    // Es importante cancelar la suscripción para evitar fugas de memoria
    // this.subscriptions.unsubscribe();
    if (this.backdropSubscription) {
      this.backdropSubscription.unsubscribe();
    }
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
    // const start = (this.currentPage - 0) * this.itemsPerPage;
    // const end = start + this.itemsPerPage;
    this.paginatedAgenda = this.agenda.slice();
    this.totalPages = Math.ceil(this.agenda.length / this.itemsPerPage);
    this.cdr.detectChanges();
    console.log('Agenda paginada:', this.paginatedAgenda);
  }

  // Nuevo método para manejar la actualización de destinatarios
  actualizarDestinatario(id_agenda: number, datos: any): void {
    this.agendaService.guardarDestinatarioEditado(id_agenda, datos).subscribe(
      () => {
        console.log('El destinatario fue actualizado correctamente');
        this.loadData();
      },
      error => console.error('Hubo un error al actualizar el destinatario', error)
    );
  }

  // Nuevo método para manejar la adición de destinatarios
  agregarDestinatario(datos: any): void {
    this.agendaService.guardarNuevoDestinatario(datos).subscribe(
      () => {
        console.log('El destinatario fue agregado correctamente');
        this.loadData();
      },
      error => console.error('Hubo un error al agregar el destinatario', error)
    );
  }

  abrirOffcanvas(): void {
    this.mostrarBackdropCustomOffcanvas.emit(true);
    this.mostrarBackdropCustomOffcanvasEstado = true;
    this.renderizarAgregarDestinatario.emit(true);
    this.renderizarAgregarDestinatarioEstado = true;
  }

  onCancelar(): void {
    this.mostrarBackdropCustomOffcanvas.emit(false);
    this.mostrarBackdropCustomOffcanvasEstado = false;
    this.renderizarAgregarDestinatario.emit(false);
    this.renderizarAgregarDestinatarioEstado = false;
  }

  abrirOffcanvasEdicion(id: number): void {
    this.mostrarBackdropCustomOffcanvas.emit(true);
    this.mostrarBackdropCustomOffcanvasEstado = true;
    this.agendaService.setId(id);
  }

  abrirModalEdicion(): void {
    console.log('Modal de edición abierto');
    var modalEdicionDestinatario = new bootstrap.Modal(document.getElementById('modalEdicionDestinatario'), {});
    modalEdicionDestinatario.show();
    this.mostrarBackdropCustomOffcanvas.emit(false);
    this.mostrarBackdropCustomOffcanvasEstado = false;

    // Mostrar el primer div
    this.enviandoDestinatarioEditado = true;
    this.datosGuardadosDestinatarioEditado = false;

    // Después de 2 segundos, mostrar el segundo div
    setTimeout(() => {
      this.enviandoDestinatarioEditado = false;
      this.datosGuardadosDestinatarioEditado = true;
    }, 2000);
  }

  abrirModalNuevoDestinatario(): void {
    var modalNuevoDestinatario = new bootstrap.Modal(document.getElementById('modalNuevoDestinatario'), {});
    modalNuevoDestinatario.show();
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

  eliminarDestinatario(): void {
    if (this.id_agenda) {
      this.agendaService.eliminarIdDestinatario(this.id_agenda).subscribe(
        () => {
          console.log('El destinatario fue eliminado correctamente');
          this.usuarioEliminado = true;
          // Eliminar el destinatario de la lista local
          this.agenda = this.agenda.filter(d => d.id_agenda !== this.id_agenda);
          this.paginarAgenda();
          this.cdr.detectChanges();
        },
        error => console.error('Hubo un error al eliminar el destinatario', error)
      );
    }
    this.consultaEliminacionDestinatario = false;
    this.destinatarioEliminado = true;
  }

  usuarioEliminadoConfirmado(): void {
    this.usuarioEliminado = false;
    this.consultaEliminacionDestinatario = true;
    this.destinatarioEliminado = false;
  }

  abrirModalEliminar(id_agenda: number): void {
    this.id_agenda = id_agenda;
    console.log(this.id_agenda);

    // Suponiendo que tienes una lista de destinatarios en el componente
    const destinatario = this.agenda.find(d => d.id_agenda === id_agenda);
    if (destinatario) {
        this.nombre = destinatario.nombre;
    }

    var modalEliminarDestinatario = new bootstrap.Modal(document.getElementById('modalEliminarDestinatario'), {});
    modalEliminarDestinatario.show();
    this.mostrarBackdropCustomOffcanvas.emit(false);
    this.mostrarBackdropCustomOffcanvasEstado = false;
  }

  ocultaBackDrop(): void {
    this.backdropService.hideModalBackdrop();
    this.mostrarBackdropCustomOffcanvas.emit(false);
    this.mostrarBackdropCustomOffcanvasEstado = false;
    this.errorServerNuevoDestinatario = false;
  }

}