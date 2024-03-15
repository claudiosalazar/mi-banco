import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UrlBrowserService {

  constructor(private router: Router) { }

  // Visa
  navegarAInicioVisa(): void {
    this.router.navigate(['/mibanco', 'transacciones', 'visa']);
  }
  navegarAPagoVisa(): void {
    this.router.navigate(['/mibanco', 'transacciones', 'visa', 'pago']);
  }
  navegarAComprobanteVisa(): void {
    this.router.navigate(['/mibanco', 'transacciones', 'visa', 'comprobante']);
  }

  // Linea de crédito
  navegarAInicioLineaDeCredito(): void {
    this.router.navigate(['/mibanco', 'transacciones', 'linea-credito']);
  }
  navegarAPagoLineaDeCredito(): void {
    this.router.navigate(['/mibanco', 'transacciones', 'linea-credito', 'pago']);
  }
  navegarAComprobanteLineaCredito(): void {
    this.router.navigate(['/mibanco', 'transacciones', 'linea-credito', 'comprobante']);
  }
  
}