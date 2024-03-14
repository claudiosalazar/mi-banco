import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UrlBrowserService {

  constructor(private router: Router) { }

  navegarAInicioVisa(): void {
    this.router.navigate(['/mibanco', 'transacciones', 'visa']);
  }

  navegarAPagoVisa(): void {
    this.router.navigate(['/mibanco', 'transacciones', 'visa', 'pago']);
  }

  navegarAComprobanteVisa(): void {
    this.router.navigate(['/mibanco', 'transacciones', 'visa', 'comprobante']);
  }
  
}