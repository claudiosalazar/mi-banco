import { Component, OnInit, ElementRef, ViewChild, OnDestroy, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AgendaDestinatariosService } from '../../../../../core/services/agenda-destinatarios.service';
import { BackdropService } from '../../../../../core/services/backdrop.service';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

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
  @Output() datosOrdenados = new EventEmitter<void>();

  //destinatarios: { [key: string]: any }[] | undefined;
  destinatarioSeleccionado: { id: any } | undefined;
  destinatarioId: any | undefined;

  destinatarios: any[] = [];
  paginatedDestinatarios: any[] = [];

  private subscription: Subscription | undefined;

  private backdropSubscription: Subscription | undefined;

  // Variables para paginador
  paginatedData: any[] | undefined;
  itemsPerPage: number = 5;
  currentPage: number = 1;
  totalPages: number | undefined;
  mostrarPaginador: boolean = true;

  // Variables para ordenar datos de tabla
  sortOrder = 1;
  sortedColumn = '';
  sortAscending: boolean = true;

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

  constructor(
    private agendaService: AgendaDestinatariosService,
    private cdr: ChangeDetectorRef,
    private cdRef: ChangeDetectorRef,
    private backdropService: BackdropService,
  ) { }

  ngOnInit(): void {
    
    // Obtén los destinatarios al inicializar el componente
    this.agendaService.getDestinatarios().subscribe(data => {
      this.destinatarios = data;
      this.totalPages = this.destinatarios ? Math.ceil(this.destinatarios.length / this.itemsPerPage) : 0;
      this.ordenarDatos('nombre');
      this.cdRef.detectChanges();
    });

    // Actualiza los destinatarios cuando se guarda un nuevo destinatario
    this.agendaService.nuevoDestinatarioGuardado.subscribe(() => {
      this.agendaService.getDestinatarios().subscribe(data => {
        // Ordena los datos por nombre en orden ascendente antes de asignarlos a this.destinatarios
        this.destinatarios = data.sort((a: { nombre: string; }, b: { nombre: any; }) => a.nombre.localeCompare(b.nombre));
        this.totalPages = this.destinatarios ? Math.ceil(this.destinatarios.length / this.itemsPerPage) : 0;
        this.cdRef.detectChanges();
      });
    });

    // Actualiza los destinatarios cuando se elimina un destinatario
    this.agendaService.destinatarioEliminado.subscribe(() => {
      this.agendaService.getDestinatarios().subscribe(data => {
        // Ordena los datos por nombre en orden ascendente antes de asignarlos a this.destinatarios
        this.destinatarios = data.sort((a: { nombre: string; }, b: { nombre: any; }) => a.nombre.localeCompare(b.nombre));
        this.totalPages = this.destinatarios ? Math.ceil(this.destinatarios.length / this.itemsPerPage) : 0;
        this.cdRef.detectChanges();
      });
    });

    this.mostrarBackdropCustomOffcanvas.subscribe(valor => {
      this.mostrarBackdropCustomOffcanvasEstado = valor;
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

    this.backdropSubscription = this.backdropService.mostrarBackdropCustomModal$.subscribe(
      mostrar => this.mostrarBackdropCustomModal = mostrar
    );
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

    this.subscription = this.agendaService.getDatosEditadosDestinatario().subscribe(datos => {
      this.datosCapturados = datos;
      this.abrirModalEdicionDestinatario();
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
    if (this.backdropSubscription) {
      this.backdropSubscription.unsubscribe();
    }
  }

  abrirOffcanvas(): void {
    this.mostrarBackdropCustomOffcanvas.emit(true);
    this.mostrarBackdropCustomOffcanvasEstado = true;
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

  // Modal para eliminar destinatario

  abrirModalEliminar(destinatario: any): void {
    this.destinatarioId = destinatario.id;
    var modalEliminarDestinatario = new bootstrap.Modal(document.getElementById('modalEliminarDestinatario'), {});
    modalEliminarDestinatario.show();
    this.backdropService.show();
  }

  eliminarDestinatario(): void {
    if (this.destinatarioId) {
      this.agendaService.eliminarDestinatarioServer(this.destinatarioId).subscribe(
        () => {
          console.log('El destinatario fue eliminado correctamente');
          this.usuarioEliminado = true;
          // Emitir el evento de destinatario eliminado
          this.agendaService.destinatarioEliminado.next();
        },
        error => console.error('Hubo un error al eliminar el destinatario', error)
      );
    }
  }

  // Modal para nuevo destinatario
  abrirModalNuevoDestinatario(): void {
    var modalNuevoDestinatario = new bootstrap.Modal(document.getElementById('modalNuevoDestinatario'), {});
    modalNuevoDestinatario.show();
    this.backdropService.show();
  
    // Indica que se están enviando los datos
    this.enviandoNuevoDestinatario = true;
  
    // Mostrar en consola los datos capturados
    // console.log('Datos capturados:', this.datosCapturados);
  
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


  // Modal para edicion destinatario
  abrirModalEdicionDestinatario(): void {
    var modalEdicionDestinatario = new bootstrap.Modal(document.getElementById('modalEdicionDestinatario'), {});
    modalEdicionDestinatario.show();
    this.backdropService.show();
  
    // Indica que se están enviando los datos
    this.enviandoDestinatarioEditado = true;
  
    // Obtén los datos editados del servicio
    const datosEditados = this.agendaService.datosEditadosDestinatario;
  
    // Mostrar en consola los datos capturados
    console.log('Datos capturados:', datosEditados);
  
    // Envía los datos al servicio
    if (this.destinatarioSeleccionado && this.destinatarioSeleccionado.id !== undefined) {
      console.log('Llamando a guardarDestinatarioEditado con los siguientes datos:', datosEditados);
      this.agendaService.guardarDestinatarioEditado(this.destinatarioSeleccionado.id, datosEditados).subscribe(destinatarioEditado => {
        // Imprime en consola el objeto destinatarioEditado que devuelve el servidor
        console.log('Datos del destinatario actualizados:', destinatarioEditado);
  
        // Espera al menos 2 segundos antes de indicar que los datos se han guardado correctamente
        setTimeout(() => {
          this.enviandoDestinatarioEditado = false;
          this.datosGuardadosDestinatarioEditado = true;
        }, 2000);
  
        // Comprueba que destinatarios está definido
        if (this.destinatarios && this.destinatarioSeleccionado) {
          // Busca el destinatario editado en la lista de destinatarios y actualiza sus datos
          const index = this.destinatarios.findIndex(d => d.id === this.datosDestinatarioEditado.id);
          if (index !== -1) {
            this.destinatarios[index] = destinatarioEditado;
          }
  
          // Ordena los destinatarios por nombre en orden ascendente
          this.destinatarios = this.destinatarios.sort((a, b) => {
            if (a.nombre && b.nombre) {
              return a.nombre.localeCompare(b.nombre);
            } else {
              return 0;
            }
          });
  
          // Forzar la actualización de los datos en la tabla
          this.destinatarios = [...this.destinatarios];
        }
  
        // Forzar la detección de cambios
        this.cdr.detectChanges();
  
        this.agendaService.datosEditadosDestinatario.next();
      }, error => {
        // Espera al menos 2 segundos antes de indicar que ha habido un error
        setTimeout(() => {
          this.enviandoDestinatarioEditado = false;
          this.errorServerDestinatarioEditado = true;
        }, 2000);
      });
    }
  }    

  ocultaBackDrop(): void {
    this.backdropService.hide();
  }
}
