import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cuenta-corriente',
  templateUrl: './cuenta-corriente.component.html'
})
export class CuentaCorrienteComponent implements OnInit {

  activeTab = '';

  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.activeTab = params['tab'] || 'ultimos-movimientos';
      this.updateActiveTab();
      this.cambiarUrl(this.activeTab);
    });
  }
  
  updateActiveTab() {
    // Obtener todos los enlaces de las pestañas y eliminar la clase 'active'
    var tabLinks = document.querySelectorAll('.nav-link');
    tabLinks.forEach(link => link.classList.remove('active'));
  
    // Agregar la clase 'active' al enlace de la pestaña deseada
    var activeLink = document.querySelector(`.nav-link[href="#${this.activeTab}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  
    // Obtener todas las pestañas y eliminar la clase 'active'
    var tabs = document.querySelectorAll('.tab-pane');
    tabs.forEach(tab => tab.classList.remove('active'));
  
    // Agregar la clase 'active' a la pestaña deseada
    var activeTab = document.querySelector(`#${this.activeTab}`);
    if (activeTab) {
      activeTab.classList.add('active');
    }
  }

  cambiarUrl(tab: string) {
    let nuevaUrl = '';
  
    switch (tab) {
      case 'movimientos':
        nuevaUrl = '/mibanco/productos/cuenta-corriente/ultimos-movimientos';
        break;
      case 'transferencias':
        nuevaUrl = '/mibanco/productos/cuenta-corriente/realizar-transferencia';
        break;
      case 'cartola':
        nuevaUrl = '/mibanco/productos/cuenta-corriente/cartola-historica';
        break;
    }
  
    this.location.go(nuevaUrl);
  }

}