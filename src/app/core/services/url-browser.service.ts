import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UrlBrowserService {

  constructor(private router: Router) { }

  pushState(state: any, title: string, url: string) {
    window.history.pushState(state, title, url);
  }

  // Cuenta corriente
  navegarAMovimientosCtaCte(): void {
    this.router.navigate(['/mibanco', 'productos', 'cuenta-corriente', 'movimientos']);
  }
  navegarATransferenciasCtaCte(): void {
    this.router.navigate(['/mibanco', 'productos', 'cuenta-corriente', 'transferencias']);
  }
  navegarAComprobanteCtaCte(): void {
    this.router.navigate(['/mibanco', 'productos', 'cuenta-corriente', 'comprobante']);
  }

  navegarACartolaCtaCte(): void {
    this.router.navigate(['/mibanco', 'productos', 'cuenta-corriente', 'cartola']);
  }
  
  // Visa
  navegarAInicioVisa(): void {
    this.router.navigate(['/mibanco', 'productos', 'visa']);
  }
  navegarAPagoVisa(): void {
    this.router.navigate(['/mibanco', 'productos', 'visa', 'pago']);
  }
  navegarAComprobanteVisa(): void {
    this.router.navigate(['/mibanco', 'productos', 'visa', 'comprobante']);
  }

  // Linea de crédito
  navegarAInicioLineaDeCredito(): void {
    this.router.navigate(['/mibanco', 'productos', 'linea-credito']);
  }
  navegarAPagoLineaDeCredito(): void {
    this.router.navigate(['/mibanco', 'productos', 'linea-credito', 'pago']);
  }
  navegarAComprobanteLineaCredito(): void {
    this.router.navigate(['/mibanco', 'productos', 'linea-credito', 'comprobante']);
  }

  // Seguros
  navegarAResumenSeguros(): void {
    this.router.navigate(['/mibanco', 'productos', 'seguros', 'resumen']);
  }
  navegarAContratarSeguro(): void {
    this.router.navigate(['/mibanco', 'productos', 'seguros', 'contratar-seguro']);
  }
  navegarAComprobanteSeguro(): void {
    this.router.navigate(['/mibanco', 'productos', 'seguros', 'comprobante']);
  }
  
}