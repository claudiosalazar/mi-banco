import { Component, OnInit } from '@angular/core';
import { DatosInicioService } from '../../services/datos-inicio.service';
import { DatosInicio } from '../../../assets/models/datos-inicio.model';

@Component({
  selector: 'app-resumen-usuario',
  templateUrl: './resumen-usuario.component.html'
})
export class ResumenUsuarioComponent implements OnInit {
  DatosInicio: DatosInicio | undefined;

  constructor(private datosInicioService: DatosInicioService) { }

  ngOnInit() {
    this.getDatosInicio();
  }

  getDatosInicio(): void {
    this.datosInicioService.getDatosInicio().subscribe(data => {
      this.DatosInicio = data;
      console.log(this.DatosInicio);
    }); 
  }

}