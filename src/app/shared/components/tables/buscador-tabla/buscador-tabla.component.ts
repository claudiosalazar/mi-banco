import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DatosFiltradosService } from 'src/app/services/datosFiltrados.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'mb-buscador-tabla',
  templateUrl: './buscador-tabla.component.html'
})
export class BuscadorTablaComponent implements OnInit {

  @Output() datosFiltradosEvent = new EventEmitter<any[]>();
  @Input() tituloBuscador: string | undefined;

  id: any | undefined;
  paginatedData: any[] | undefined;
  valorBusqueda: any | undefined;
  campoBusqueda = new FormControl('');
  
  constructor(
    private datosFiltradosService: DatosFiltradosService
  ) { }

  ngOnInit() {
    combineLatest([
      this.campoBusqueda.valueChanges,
      this.datosFiltradosService.getIdActual()
    ]).subscribe(([valorBusqueda]) => {
      this.valorBusqueda = valorBusqueda;
  
      this.datosFiltradosService.buscarDatos(this.valorBusqueda || '').subscribe(datosFiltrados => {
        if (Array.isArray(datosFiltrados)) {
          this.updateTable(datosFiltrados);
        }
      });
    });
  }
  
  updateTable(datosFiltrados: any[]) {
    this.paginatedData = datosFiltrados;
    this.datosFiltradosService.actualizarDatosFiltrados(datosFiltrados);
  }
}