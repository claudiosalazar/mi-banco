import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, catchError, map, throwError } from 'rxjs';
import { ProductosUsuario } from '../../shared/models/productos-usuario.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosUsuarioService {

  private baseUrl = 'http://localhost:3000/backend/data/productos-usuario.json';
  
  constructor(private http: HttpClient) { }

  fecha: any;
  cupoDisponibleVisa: Number | undefined;

  getProductosUsuarioResumen(id: string): Observable<ProductosUsuario> {
    const url = `${this.baseUrl}?id=${id}`;
    console.log('URL de la solicitud:', url);
    return this.http.get<ProductosUsuario>(url).pipe(
      catchError(error => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }

  // Llama a todos los datos de productos
  getProductosUsuario(id: number): Observable<ProductosUsuario['productos'][0]> {
    const url = `${this.baseUrl}`;
    console.log('URL de la solicitud:', url);
    return this.http.get<ProductosUsuario>(url).pipe(
      map(data => {
        if (data && data.productos) {
          const producto = data.productos.find(producto => producto.id === id);
          if (producto) {
            return producto;
          } else {
            throw new Error('ID no encontrado');
          }
        } else {
          throw new Error('No se encontraron productos');
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error:', error);
        return throwError('Error al analizar la respuesta del servidor como JSON');
      })
    );
  }

  // llama los datos para ser usados en una tabla
  getProductosUsuarioTable(): Observable<ProductosUsuario> {
    const url = `${this.baseUrl}`;
    console.log('URL de la solicitud:', url);
    return new Observable(observer => {
      this.http.get<ProductosUsuario>(url).pipe(
        catchError(error => {
          console.error('Error:', error);
          return throwError(error);
        })
      ).subscribe(data => {
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

  // Calcula el saldo de un producto
  calculosMontos(producto: ProductosUsuario['productos'][0]): ProductosUsuario['productos'][0] {
    if (producto.transacciones.length > 0) {
      producto.transacciones[0].saldo = (parseFloat(producto.cupo) - parseFloat(producto.transacciones[0].cargo)).toString();
    }
    for (let i = 1; i < producto.transacciones.length; i++) {
      if (parseFloat(producto.transacciones[i].cargo) > 0) {
        producto.transacciones[i].saldo = (parseFloat(producto.transacciones[i - 1].saldo) - parseFloat(producto.transacciones[i].cargo)).toString();
      }
      if (parseFloat(producto.transacciones[i].abono) > 0) {
        producto.transacciones[i].saldo = (parseFloat(producto.transacciones[i - 1].saldo) + parseFloat(producto.transacciones[i].abono)).toString();
      }
    }
    if (producto.transacciones && producto.transacciones.length > 0) {
      console.log('Último cálculo guardado en saldo:', producto.transacciones[producto.transacciones.length - 1].saldo);
    }
  
    // Calcula el cupo disponible restando el saldo del cupo
    const cupoDisponible = parseFloat(producto.cupo) - parseFloat(producto.transacciones[producto.transacciones.length - 1].saldo);
  
    // Agrega el cupo disponible al producto
    producto.cupoDisponible = cupoDisponible.toString();
  
    // Imprime el cupo disponible en la consola
    console.log('Cupo disponible:', producto.cupoDisponible);
  
    return producto;
  }

  
  guardaResultadosCalculos(): void {
    this.getProductosUsuarioTable().subscribe(productosUsuario => {
      productosUsuario.productos = productosUsuario.productos.map(producto => this.calculosMontos(producto));
      // Guarda los datos actualizados en el archivo productos-usuario.json
      this.http.put(this.baseUrl, productosUsuario).subscribe((res: any) => {
        // Los datos actualizados están en 'res'
        const datosActualizados = res;
      });
    });
  }
  

  // Codigo para buscador
  private idActual = new BehaviorSubject<string>('');

  getIdActual() {
    return this.idActual.asObservable();
  }

  buscarDatos(valorBusqueda: any, id: any) {
    return new Observable(observer => {
      this.getProductosUsuarioResumen(id).subscribe(datos => {
        if (datos && datos.productos) {
          const producto = datos.productos.find(producto => producto.id === id);
          if (producto) {
            const datosFiltrados = producto.transacciones.filter(transaccion => {
              // Cambia 'propiedad1', 'propiedad2', etc., por las propiedades correctas
              return transaccion.fecha.toLowerCase().includes(valorBusqueda.toLowerCase()) ||
                     transaccion.detalle.toLowerCase().includes(valorBusqueda.toLowerCase()) ||
                     transaccion.cargo.toLowerCase().includes(valorBusqueda.toLowerCase()) ||
                     transaccion.abono.toLowerCase().includes(valorBusqueda.toLowerCase()) ||
                     transaccion.saldo.toLowerCase().includes(valorBusqueda.toLowerCase());
            });
  
            observer.next(datosFiltrados);
            observer.complete();
          } else {
            observer.next([]);
            observer.complete();
          }
        } else {
          observer.error('No se encontraron productos');
        }
      }, error => {
        observer.error(error);
      });
    });
  }

  actualizarIdActual(nuevoId: string) {
    this.idActual.next(nuevoId);
  }

}

export class DatosFiltradosService {
  private datosFiltradosSource = new Subject<any[]>();
  datosFiltrados$ = this.datosFiltradosSource.asObservable();
  paginationData = new Subject<{ itemsPerPage: number, currentPage: number }>();
  paginationData$ = this.paginationData.asObservable();

  actualizarDatosFiltrados(datosFiltrados: any[]) {
    this.datosFiltradosSource.next(datosFiltrados);
    this.paginationData.next({ itemsPerPage: 5, currentPage: 1 });
  }
}
