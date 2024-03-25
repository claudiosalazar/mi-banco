import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { AgendaDestinatariosService } from '../../../../../core/services/agenda-destinatarios.service';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { catchError, switchMap } from 'rxjs/operators';

declare var bootstrap: any;

@Component({
  selector: 'app-agenda-destinatarios',
  templateUrl: './agenda-destinatarios.component.html'
})
export class AgendaDestinatariosComponent implements OnInit, OnDestroy {

  @ViewChild('modalNuevoDestinatario') modalNuevoDestinatario: ElementRef | undefined;
  @ViewChild('crearDestinatarioCanvas') crearDestinatarioCanvas: ElementRef | undefined;

  destinatarios: { [key: string]: any }[] | undefined;
  destinatarioSeleccionado: { id: any } | undefined;

  private baseUrl = 'http://localhost:3000/backend/data/agenda-usuarios-transferencias';
  

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

  // Variable para mensajes de modal
  usuarioEliminado = false;
  errorServer = false;

  // Variables para modal de nuevo destinatario
  private subscription: Subscription | undefined;
  datosNuevoDestinatario: any;
  envioDatosNuevoDestinatario: boolean = true;
  errorServerNuevoDestinatario: boolean = false;
  datosGuardadosNuevoDestinatario: boolean = false;
  public mostrarOffcanvas = true;
  offcanvasRef: any;

  constructor(
    private agendaService: AgendaDestinatariosService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.agendaService.getDestinatarios().subscribe(data => {
      this.destinatarios = data;
      this.totalPages = this.destinatarios ? Math.ceil(this.destinatarios.length / this.itemsPerPage) : 0;
      this.ordenarDatos('nombre');
      this.paginacionDatos();
    });
  }

  ngAfterViewInit(_e: Event): void {
    this.subscription = this.agendaService.getDatosNuevoDestinatario().subscribe(datos => {
      // Aquí puedes manejar los datos recibidos
      console.log('Se recibieron los datos de datosNuevoDestinatario:', datos);
  
      // Cierra el offcanvas
      if (this.offcanvasRef) {
        this.offcanvasRef.hide();
      }
  
      // Elimina el backdrop del DOM
      const backdrop = document.querySelector('.offcanvas-backdrop.fade.show');
      if (backdrop && backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
      }
  
      this.mostrarOffcanvas = false;
  
      // Abre el modal
      this.abrirModalNuevoDestinatario();
    });
  }

  ngOnDestroy(): void {
    // Es importante cancelar la suscripción para evitar fugas de memoria
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  abrirOffcanvas(_e: Event): void {
    const handleClick = (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      const offcanvasElement = new bootstrap.Offcanvas(this.crearDestinatarioCanvas?.nativeElement, {backdrop: false, keyboard: true});
      offcanvasElement.show();
    };
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
    this.paginacionDatos();
  }

  // Functions para paginados
  paginacionDatos(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = this.currentPage * this.itemsPerPage;
    this.paginatedData = this.destinatarios ? this.destinatarios.slice(startIndex, endIndex) : [];
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginacionDatos();
    }
  }
  
  nextPage(): void {
    if (this.totalPages && this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginacionDatos();
    }
  }
  
  seleccionarPagina(page: number): void {
    this.currentPage = page;
    this.paginacionDatos();
  }

  // Modal para eliminar destinatario
  abrirModalEliminar(destinatario: any): void {
    this.destinatarioSeleccionado = destinatario;
    var modalElininar = new bootstrap.Modal(document.getElementById('modalEliminarDestinatario'), {});
    modalElininar.show();
  }

  // Elimina usuario del server
  eliminarDestinatario(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {responseType: 'text'}).pipe(
      switchMap((response) => {
        if (response) {
          console.log('El usuario fue eliminado correctamente');
          this.usuarioEliminado = true;
        }
        return this.agendaService.getDestinatarios();
      }),
      tap(destinatarios => {
        this.destinatarios = destinatarios;
        this.totalPages = this.destinatarios ? Math.ceil(this.destinatarios.length / this.itemsPerPage) : 0;
        this.ordenarDatos('nombre');
        this.paginacionDatos();
      }),
      catchError(error => {
        console.log('Hubo un error al eliminar el usuario', error);
        this.errorServer = true;
        return throwError(error);
      })
    );
  }

  /*escucharCambiosDestinatario(): Observable<any> {
    return this.agendaService.getDatosNuevoDestinatario().pipe(
      tap(datos => {
        if (datos) {
          console.log('Se recibieron los datos de datosNuevoDestinatario:', datos);
        } else {
          console.log('No se recibieron datos de datosNuevoDestinatario');
        }
      })
    );
  }*/

  // Modal para eliminar destinatario
  abrirModalNuevoDestinatario(): void {
    // this.renderer.addClass(this.modalNuevoDestinatario?.nativeElement, 'show');
  }

}
