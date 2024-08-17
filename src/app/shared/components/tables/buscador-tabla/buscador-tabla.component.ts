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
  @Output() reiniciarPaginacionEvent = new EventEmitter<void>();
  @Input() tituloBuscador: string | undefined;

  paginatedData: any[] | undefined;
  valorBusqueda: any | undefined;
  campoBusqueda = new FormControl('');
  
  constructor(
    private datosFiltradosService: DatosFiltradosService
  ) { }

  ngOnInit() {
    combineLatest([
      this.campoBusqueda.valueChanges,
    ]).subscribe(([valorBusqueda]) => {
      this.valorBusqueda = valorBusqueda;
  
      this.datosFiltradosService.buscarDatos(this.valorBusqueda || '').subscribe(datosFiltrados => {
        if (Array.isArray(datosFiltrados)) {
          this.datosFiltradosEvent.emit(datosFiltrados);
          this.reiniciarPaginacionEvent.emit(); // Emitir evento para reiniciar la paginación
        }
      });
    });
  }
}