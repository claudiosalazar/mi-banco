import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Productos } from '../models/productos.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  //private apiUrl = 'http://localhost:3000';
  private apiUrl = 'https://claudiosalazar.cl/mi-banco';

  constructor(private http: HttpClient) { }

  getProductos(): Observable<Productos[]> {
    return this.http.get<Productos[]>(`${this.apiUrl}/mibanco/productos`);
  }
}