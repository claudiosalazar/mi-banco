import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OfertasProductos } from '../../shared/models/ofertas-productos.model';

@Injectable({
  providedIn: 'root'
})
export class OfertasProductosService {
  //private baseUrl = 'http://localhost:3000/backend/data/ofertas-productos.json';
  private baseUrl = 'https://www.claudiosalazar.cl/mi-banco/angular/backend/data/ofertas-productos.json';
  constructor(private http: HttpClient) { }

  getOfertasProductos(id: any): Observable<OfertasProductos> {
    const url = `${this.baseUrl}?id=${id}`;
    console.log('URL de la solicitud:', url);
    return this.http.get<OfertasProductos>(url);
  }

}
