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
      const idUserNumber = parseInt(localStorage.getItem('id_user') ?? '', 10);

      this.datosFiltradosService.buscarDatos(idUserNumber, this.valorBusqueda || '').subscribe(datosFiltrados => {
        if (Array.isArray(datosFiltrados)) {
          this.datosFiltradosEvent.emit(datosFiltrados);
        }
      });
    });
  }
}