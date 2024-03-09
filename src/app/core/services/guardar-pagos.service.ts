import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductosUsuario } from '../../shared/models/productos-usuario.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GuardaPagoProductosService {

  private baseUrl = 'http://localhost:3000/backend/data/productos-usuario.json';
  productosUsuario: { productos: any[] } = { productos: [] };
  montoPagado: any;
  guardaPagoProductosService: any;
  datosPagoString: any;
  
  constructor(
    private http: HttpClient,
  ) { }

  /* getDatosPagoVisa(datosPagoString: Observable<any>): Observable<ProductosUsuario>  {
    datosPagoString.subscribe(productosUsuario => {
      const datosPago = JSON.parse(productosUsuario);
      console.log('Datos de pago:', datosPago);
    });
    return of (this.datosPagoString);
  } */

  /* putPagoVisa(datosPagoString: any): void {
    console.log('Datos recibidos:', datosPagoString);
  
    // URL del servidor donde se encuentra el archivo productos-usuario.json
    const url = `${this.baseUrl}`;
  
    // Realiza una solicitud HTTP PUT para guardar los datos en el archivo
    this.http.put(url, datosPagoString, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(
      () => {
        console.log('Los datos fueron guardados exitosamente.');
      },
      error => {
        console.error('Ocurrió un error al guardar los datos:', error);
      }
    );
  } */
}