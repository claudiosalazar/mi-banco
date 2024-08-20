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
    const idUser = localStorage.getItem('id_user');
    if (idUser) {
      const idUserNumber = Number(idUser); // Convertir a número
      this.segurosService.getSeguros(idUserNumber).subscribe((seguros: Seguros[]) => {
        if (seguros) {
          this.seguros = seguros;
        }
      });
    } else {
      console.error('No se encontró id_user en el localStorage');
    }
  }
}