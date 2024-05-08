import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { ProductosUsuarioService } from '../../../../../core/services/productos-usuario.service';
import { FormControl } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-ultimas-transferencias',
  templateUrl: './ultimas-transferencias.component.html'
})
export class UltimasTransferenciasComponent implements OnInit {

  @Output() datosOrdenados = new EventEmitter<void>();

  transacciones: any[] = [];
  paginatedTransacciones: any[] = [];

  // Variables para ordenar datos de tabla
  sortOrder = 1;
  sortedColumn = '';
  sortAscending: boolean = true;

  busquedaTransferencias = new FormControl('');

  // Variable para animacion de icono en th
  public isRotatedIn: boolean = false;
  public columnaSeleccionada: string = '';
  productos: any[] = [];

  constructor(
    private productosUsuarioService: ProductosUsuarioService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getTransferencias();

    this.busquedaTransferencias.valueChanges
    .pipe(
      switchMap(valorBusqueda => valorBusqueda ? this.productosUsuarioService.buscarTransferencias(valorBusqueda) : of([]))
    )
    .subscribe(datosFiltrados => {
      this.transacciones = datosFiltrados as any[];
      this.cdRef.detectChanges();
    });
  }

  // Anima icono de TH
  public onHeaderClick(): void {
    this.isRotatedIn = !this.isRotatedIn;
  }

  // Captura datos de transferencias del services
  getTransferencias(): void {
    this.productosUsuarioService.getTransferenciasCtaCte()
      .subscribe(datosFiltrados => {
        this.transacciones = datosFiltrados;
        this.transacciones.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        this.cdRef.detectChanges();
      });
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
    this.transacciones?.sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {
      return a[column] > b[column] ? this.sortOrder : a[column] < b[column] ? -this.sortOrder : 0;
    });
    
    this.transacciones?.sort((a: { [x: string]: string; }, b: { [x: string]: string; }) => {
      return a[column].localeCompare(b[column]) * this.sortOrder;
    });
  
    this.datosOrdenados.emit();
  }

  

}
