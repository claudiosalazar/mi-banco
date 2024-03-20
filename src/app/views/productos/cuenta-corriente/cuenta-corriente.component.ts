import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cuenta-corriente',
  templateUrl: './cuenta-corriente.component.html'
})
export class CuentaCorrienteComponent {

  currentUrl: any;

  constructor(
    private route: Router
  ) {
    this.currentUrl = this.route.url;
   }

}