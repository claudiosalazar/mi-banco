import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UrlBrowserService } from 'src/app/core/services/url-browser.service';

@Component({
  selector: 'app-cuenta-corriente',
  templateUrl: './cuenta-corriente.component.html'
})
export class CuentaCorrienteComponent implements OnInit, AfterViewInit  {

  activeTab = '';

  constructor(
    private route: ActivatedRoute,
    private urlBrowserService: UrlBrowserService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.activeTab = params['tab'] || 'movimientos';
      this.updateActiveTab();
    });
  }

  ngAfterViewInit() {
    this.updateActiveTab();
  }

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
    this.updateActiveTab();
    this.urlBrowserService.pushState({}, '', `/mibanco/productos/cuenta-corriente/${tabId}`);
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
    var tab = document.querySelector(`#${this.activeTab}`);
    if (tab) {
      tab.classList.add('active');
    }
  }

}