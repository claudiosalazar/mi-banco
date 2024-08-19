import { Component, OnInit, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { TransaccionesService } from '../../../../../../../services/transacciones.service';
import { FormControl } from '@angular/forms';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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
  itemsPerPage = 5;
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

    this.busquedaTransferencia.valueChanges
      .pipe(
        switchMap(valorBusqueda => {
          if (valorBusqueda) {
            return this.datosFiltradosService.buscarDatosTransferencias(valorBusqueda);
          } else {
            this.currentPage = 1;
            this.transferencias = [...this.originalData];
            this.paginarTransferencias();
            this.cdr.detectChanges();
            return of(this.originalData);
          }
        })
      )
      .subscribe(datosFiltrados => {
        this.handleDatosFiltrados(datosFiltrados);
      });
  }

  loadData() {
    this.transaccionesService.getTransCuentaCorrienteTransferencia().subscribe((transferencias: any[]) => {
      this.handleTransacciones(transferencias);
    });
  }

  handleTransacciones(transacciones: any[]): void {
    if (transacciones) {
      this.transferencias = transacciones.filter(transaccion => transaccion);
      this.originalData = [...this.transferencias];
      this.paginarTransferencias();
      this.cdr.detectChanges();
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