import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatosInicioService } from '../../../services/datos-inicio.service';
import { BreadcrumbService } from '../../../services/breadcrumb.service';
import { DatosInicio } from '../../../../assets/models/datos-inicio.model';

@Component({
  selector: 'app-resumen-usuario',
  templateUrl: './resumen-usuario.component.html'
})
export class ResumenUsuarioComponent implements OnInit, OnDestroy {
  DatosInicio: DatosInicio | undefined;

  constructor(
    private datosInicioService: DatosInicioService,
    private breadcrumbService: BreadcrumbService
  ) { }

  ngOnInit() {
    this.getDatosInicio();
    this.breadcrumbService.hide();
  }

  ngOnDestroy() {
    this.breadcrumbService.show();
  }

  getDatosInicio(): void {
    this.datosInicioService.getDatosInicio().subscribe(data => {
      this.DatosInicio = data;
      console.log(this.DatosInicio);
    }); 
  }

}