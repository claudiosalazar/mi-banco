import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Productos } from '../models/productos.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getProductos(): Observable<Productos[]> {
    const idUser = localStorage.getItem('id_user') || '';
    const params = new HttpParams().set('id_user', idUser);
    return this.http.get<Productos[]>(`${this.apiUrl}/mibanco/productos`, { params });
  }
}