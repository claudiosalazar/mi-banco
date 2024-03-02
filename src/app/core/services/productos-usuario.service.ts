import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductosUsuario } from '../../shared/models/productos-usuario.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosUsuarioService {
  private baseUrl = 'http://localhost:3000/backend/data/productos-usuario.json';
  constructor(private http: HttpClient) {
    this.calcularYSalvarSaldo();
   }

  getProductosUsuarioResumen(id: string): Observable<ProductosUsuario> {
    const url = `${this.baseUrl}?id=${id}`;
    console.log('URL de la solicitud:', url);
    return this.http.get<ProductosUsuario>(url);
  }

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

  calcularSaldo(producto: ProductosUsuario['productos'][0]): ProductosUsuario['productos'][0] {
    // Asigna el valor de 'cupo' al saldo del ID 0 de las transacciones
    if (producto.transacciones.length > 0) {
      producto.transacciones[0].saldo = (parseFloat(producto.cupo) - parseFloat(producto.transacciones[0].cargo)).toString();
    }
  
    // Realiza el cálculo para los demás IDs
    for (let i = 1; i < producto.transacciones.length; i++) {
      if (parseFloat(producto.transacciones[i].cargo) > 0) {
        producto.transacciones[i].saldo = (parseFloat(producto.transacciones[i - 1].saldo) - parseFloat(producto.transacciones[i].cargo)).toString();
      }
      if (parseFloat(producto.transacciones[i].abono) > 0) {
        producto.transacciones[i].saldo = (parseFloat(producto.transacciones[i - 1].saldo) + parseFloat(producto.transacciones[i].abono)).toString();
      }
    }
  
    // Muestra el último cálculo guardado en 'saldo'
    if (producto.transacciones && producto.transacciones.length > 0) {
      console.log('Último cálculo guardado en saldo:', producto.transacciones[producto.transacciones.length - 1].saldo);
    }
  
    return producto;
  }
  
  calcularYSalvarSaldo(): void {
    this.getProductosUsuarioTable().subscribe(productosUsuario => {
      productosUsuario.productos = productosUsuario.productos.map(producto => this.calcularSaldo(producto));
  
      // Guarda los datos actualizados en el archivo productos-usuario.json
      this.http.put(this.baseUrl, productosUsuario).subscribe((res: any) => {
        // Los datos actualizados están en 'res'
        const datosActualizados = res;
      }, error => {
        // Manejo de errores
      });
    });
  }

}
