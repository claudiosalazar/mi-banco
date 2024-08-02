import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BuscadorTablaService } from 'src/app/services/buscadorTabla.service';


@Component({
  selector: 'app-buscador-tabla',
  templateUrl: './buscador-tabla.component.html'
})
export class BuscadorTablaComponent implements OnInit {

  @Output() datosFiltradosEvent = new EventEmitter<any[]>();
  @Input() tituloBuscador: string | undefined;
  
  
  constructor(
    private buscadorTablaService: BuscadorTablaService
  ) { }

  ngOnInit() {
    
  }
}