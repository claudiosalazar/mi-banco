import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TransaccionesService, DatosFiltradosService } from 'src/app/services/transacciones.service';
import { Transacciones } from 'src/app/models/transacciones.model';
import { combineLatest, debounceTime } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-buscador-tabla',
  templateUrl: './buscador-tabla.component.html'
})
export class BuscadorTablaComponent implements OnInit {

  @Output() datosFiltradosEvent = new EventEmitter<any[]>();
  @Input() tituloBuscador: string | undefined;
  
  
  constructor(
    private transaccionesService: TransaccionesService,
    private datosFiltradosService: DatosFiltradosService
  ) { }

  ngOnInit() {
    
  }
}