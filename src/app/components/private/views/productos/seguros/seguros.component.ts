import { Component, OnInit } from '@angular/core';
import { SegurosService } from '../../../../../services/seguros.service';
import { Seguros } from '../../../../../models/seguros.model';

@Component({
  selector: 'app-seguros',
  templateUrl: './seguros.component.html'
})
export class SegurosComponent implements OnInit {

  seguros: Seguros[] = [];

  constructor(
    private segurosService: SegurosService
  ) { }

  ngOnInit() {
    this.segurosService.getSeguros().subscribe((seguros: Seguros[]) => {
      if (seguros) {
        this.seguros = seguros;
      }
    });
  }

}