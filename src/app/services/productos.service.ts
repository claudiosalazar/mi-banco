import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Productos } from '../models/productos.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private URL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getSeguros(): Observable<Productos[]> {
    return this.http.get<Productos[]>(`${this.URL}/mibanco/productos`);
  }
}