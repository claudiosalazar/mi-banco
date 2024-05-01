// mi-banco.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MostrarBreadcrumbService } from './core/services/mostrar-breadcrumb.service';

@Component({
  selector: 'app-root',
  templateUrl: './mi-banco.component.html'
})
export class MiBancoComponent implements OnInit {
  title = 'Mi Banco';

  isResumenUsuarioPage = false;

  constructor(
    private router: Router,
    private mostrarBreadcrumbService: MostrarBreadcrumbService
  ) {}

  ngOnInit() {
    this.mostrarBreadcrumbService.estadoActual.subscribe(estado => {
      this.isResumenUsuarioPage = estado;
    });
  }
}