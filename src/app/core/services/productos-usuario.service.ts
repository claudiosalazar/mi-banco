import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ProductosUsuario } from '../../shared/models/productos-usuario.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosUsuarioService {
  private baseUrl = 'http://localhost:3000/backend/data/productos-usuario.json';
  constructor(private http: HttpClient) { }

  // Llama a todos los datos de productos
  getProductosUsuario(id: string): Observable<ProductosUsuario['productos'][0]> {
    const url = `${this.baseUrl}?id=${id}`;
    console.log('URL de la solicitud:', url);
    return new Observable(observer => {
      this.http.get<ProductosUsuario>(url).subscribe(data => {
        const producto = data.productos.find(producto => producto.id === id);
        if (producto) {
          observer.next(producto);
        } else {
          observer.error('ID no encontrado');
        }
        observer.complete();
      }, error => {
        observer.error(error);
        observer.complete();
      });
    });
  }

  // llama los datos para ser usados en una tabla
  getProductosUsuarioTable(): Observable<ProductosUsuario> {
    const url = `${this.baseUrl}`;
    console.log('URL de la solicitud:', url);
    return new Observable(observer => {
      this.http.get<ProductosUsuario>(url).subscribe(data => {
        if (data) {
          observer.next(data);
        } else {
          observer.error('No se encontraron datos');
        }
        observer.complete();
      }, error => {
        observer.error(error);
        observer.complete();
      });
    });
  }

}
