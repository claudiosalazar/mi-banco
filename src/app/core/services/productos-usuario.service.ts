import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductosUsuario } from '../../shared/models/productos-usuario.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosUsuarioService {
  private baseUrl = 'http://localhost:3000/backend/data/productos-usuario.json';
  constructor(private http: HttpClient) { }

  getProductosUsuario(id: string): Observable<ProductosUsuario> {
    const url = `${this.baseUrl}?id=${id}`;
    console.log('URL de la solicitud:', url);
    return this.http.get<ProductosUsuario>(url);
  }

}
