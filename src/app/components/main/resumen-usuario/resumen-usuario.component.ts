import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatosUsuarioService } from '../../../services/datos-usuario.service';
import { BreadcrumbService } from '../../../services/breadcrumb.service';
import { DatosUsuarioActual } from '../../../../assets/models/datos-usuario.model';

@Component({
  selector: 'app-resumen-usuario',
  templateUrl: './resumen-usuario.component.html'
})
export class ResumenUsuarioComponent implements OnInit, OnDestroy {
  datosUsuarioActual: DatosUsuarioActual | undefined;

  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private montosUsuarioService: DatosUsuarioService,
    private breadcrumbService: BreadcrumbService
  ) { }

  ngOnInit() {
    this.getDatosUsuario();
    this.breadcrumbService.hide();
  }
  

  ngOnDestroy() {
    this.breadcrumbService.show();
  }

  getDatosUsuario(): void {
    this.datosUsuarioService.getDatosUsuario().subscribe(data => {
      this.datosUsuarioActual = data;
    });
  }

  getMontosUsuario(): void {
    this.montosUsuarioService.getDatosUsuario().subscribe(data => {
      this.datosUsuarioActual = data;
    });
  }

}