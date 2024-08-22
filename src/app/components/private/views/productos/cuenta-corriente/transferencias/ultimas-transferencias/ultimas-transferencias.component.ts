import { Component, OnInit, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { TransaccionesService } from '../../../../../../../services/transacciones.service';
import { FormControl } from '@angular/forms';
import { of } from 'rxjs';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';
import { DatosFiltradosService } from '../../../../../../../services/datosFiltrados.service'; // Importar el servicio

@Component({
  selector: 'app-ultimas-transferencias',
  templateUrl: './ultimas-transferencias.component.html'
})
export class UltimasTransferenciasComponent implements OnInit {

  busquedaTransferencia = new FormControl('');
  datosOrdenados = new EventEmitter<void>();

  public columnaSeleccionada: string | undefined;
  public isRotatedIn: boolean = false;

  transferencias: any[] = [];
  paginatedTransferencias: any[] = [];

  // Variables para ordenar datos de tabla
  sortOrder = 1;
  sortedColumn: any;
  sortAscending: boolean = true;

  // Variables para busqueda y tabla
  mostrarPaginador: boolean | undefined;
  originalData: any[] = [];
  itemsPerPage: any;
  currentPage = 1;
  paginatedData: any[] | undefined;
  totalPages: any;

  tablaConDatos: boolean = true;
  mostrarAlerta: boolean = false;

  constructor(
    private transaccionesService: TransaccionesService,
    private cdr: ChangeDetectorRef,
    private datosFiltradosService: DatosFiltradosService // Inyectar el servicio
  ) { }

  ngOnInit() {
    this.loadData();

    this.busquedaTransferencia.valueChanges.pipe(
      distinctUntilChanged(),
      switchMap(valorBusqueda => {
        const storedIdUser = localStorage.getItem('id_user');
        if (storedIdUser) {
          const idUserNumber = parseInt(storedIdUser, 10);
          if (valorBusqueda) {
            return this.datosFiltradosService.buscarDatosTransferencias(idUserNumber, valorBusqueda);
          } else {
            this.currentPage = 1;
            this.transferencias = [...this.originalData];
            this.paginarTransferencias();
            this.cdr.detectChanges();
            if (this.mostrarAlerta === true || this.tablaConDatos === false || this.currentPage === 0) {
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

  loadData() {
    const idUser = localStorage.getItem('id_user');
    const idUserNumber = idUser ? parseInt(idUser, 10) : 0; // O sessionStorage.getItem('id_user')
    this.transaccionesService.getTransCuentaCorrienteTransferencia(idUserNumber);

    const storedIdUser = localStorage.getItem('id_user'); // O sessionStorage.getItem('id_user')
    if (storedIdUser) {
      const idUserNumber = parseInt(storedIdUser, 10);
      this.transaccionesService.getTransCuentaCorrienteTransferencia(idUserNumber).subscribe(
        (data: any[]) => {
          // Aquí capturas los datos de la agenda
          console.log('Datos de la agenda:', data);
          // Puedes asignar los datos a una propiedad del componente si es necesario
          this.transferencias = data;
          this.originalData = [...data]; // Guardar una copia de los datos originales
          this.paginarTransferencias();
        },
        (error) => {
          console.error('Error al obtener la agenda:', error);
        }
      );
    } else {
      console.error('No se encontró id_user en el almacenamiento');
    }
  }

  handleDatosFiltrados(datosFiltrados: any[]): void {
    this.transferencias = datosFiltrados;
    this.totalPages = this.transferencias ? Math.ceil(this.transferencias.length / this.itemsPerPage) : 0;
    this.paginarTransferencias();
    this.cdr.detectChanges();

    // Aplicar la lógica de verificación de datos
    if (this.transferencias.length === 0) {
      this.tablaConDatos = false;
      this.mostrarAlerta = true;
    } else {
      this.tablaConDatos = true;
      this.mostrarAlerta = false;
    }
  }

  buscarTransacciones(termino: string): void {
    if (!termino) {
      this.transferencias = [...this.originalData];
    } else {
      this.transferencias = this.originalData.filter(transaccion => {
        return Object.values(transaccion).some((value: unknown) =>
          (value as string).toString().toLowerCase().includes(termino.toLowerCase())
        );
      });
    }
    this.currentPage = 1; // Reiniciar a la primera página
    this.paginarTransferencias();
  }

  onBuscar(termino: string): void {
    this.buscarTransacciones(termino);
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

    this.transferencias?.sort((a: { [x: string]: number; }, b: { [x: string]: number; }) => {
      return a[column] > b[column] ? this.sortOrder : a[column] < b[column] ? -this.sortOrder : 0;
    });
    this.paginarTransferencias();
    this.datosOrdenados.emit();
    this.cdr.detectChanges();
  }

  paginarTransferencias(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedTransferencias = this.transferencias.slice(start, end);
    this.totalPages = Math.ceil(this.transferencias.length / this.itemsPerPage);
    this.cdr.detectChanges();
    console.log('Transferencias paginadas:', this.paginatedTransferencias);
  }

  cambiarPagina(pagina: number): void {
    this.currentPage = pagina;
    this.paginarTransferencias();
    this.cdr.detectChanges();
  }

  public onHeaderClick(): void {
    this.isRotatedIn = !this.isRotatedIn;
    this.cdr.detectChanges();
  }
}