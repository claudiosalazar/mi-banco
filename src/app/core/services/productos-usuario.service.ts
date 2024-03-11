import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, catchError, map, of, throwError } from 'rxjs';
import { ProductosUsuario } from '../../shared/models/productos-usuario.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosUsuarioService {

  private baseUrl = 'http://localhost:3000/backend/data/productos-usuario.json';
  productos: ProductosUsuario['productos'] = [];
  saldo: string | undefined;
  fecha: any;
  cupoDisponibleVisa: Number | undefined;
  
  constructor(
    private http: HttpClient
  ) {
    this.http.get(this.baseUrl).subscribe((data: any) => {
      console.log('Respuesta del servidor:', data);
      if (data && Array.isArray(data.productos)) {
        this.productos = data.productos;
        data.productos.forEach((producto: any) => {
          console.log('ID del producto:', producto.id);
          if (producto && producto.transacciones) {
            const nuevosDatos = this.calculosMontos(producto);
            this.guardaResultadosCalculos(nuevosDatos).subscribe();
          } else {
            console.error('Transacciones no definidas en el producto:', producto);
          }
        });
      } else {
        console.error('data o data.productos es undefined');
      }
    });
  }

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
  calculosMontos(producto: ProductosUsuario['productos']): ProductosUsuario['productos'] {

    // Crear una variable para almacenar los nuevos datos
    let nuevosDatos: ProductosUsuario['productos'] = [];

    // Comprobar si this.productos está definido y es un array
    if (this.productos && Array.isArray(this.productos)) {
      this.productos.forEach((producto: {
        cupoDisponible: string; transacciones: any[]; cupo: string; id: any; productoNombre: any; productoNumero: any; }) => {
          // Realiza los cálculos para cada producto
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
          const saldoCalculado = parseFloat(producto.cupo) - parseFloat(producto.transacciones[producto.transacciones.length - 1].saldo);
          const cupoDisponibleCalculado = parseFloat(producto.cupo) - saldoCalculado;

          // Agrega el cupo disponible al producto
          producto.transacciones[producto.transacciones.length - 1].saldo = saldoCalculado.toString();
          producto.cupoDisponible = cupoDisponibleCalculado.toString();
      
          // Crea un nuevo objeto con la misma estructura que productos-usuario.json
          const nuevoDatosProducto: ProductosUsuario['productos'][0] = {
            id: producto.id,
            productoNombre: producto.productoNombre,
            productoNumero: producto.productoNumero,
            cupo: producto.cupo,
            cupoDisponible: cupoDisponibleCalculado.toString(),
            transacciones: producto.transacciones && Array.isArray(producto.transacciones) ? producto.transacciones.map(transaccion => ({
              id: transaccion.id,
              fecha: transaccion.fecha,
              detalle: transaccion.detalle,
              cargo: transaccion.cargo,
              abono: transaccion.abono,
              saldo: saldoCalculado.toString()
            })) : []
          };
          
          // Agrega el nuevo producto a nuevosDatos
        nuevosDatos.push(nuevoDatosProducto);
      });
    } else {
      console.error('this.productos no está definido o no es un array');
    }
    return nuevosDatos;

  }

  
  guardaResultadosCalculos(nuevosDatos: ProductosUsuario['productos']): Observable<any> {
    console.log('guardaResultadosCalculos se ha activado');
    
    // Guarda los datos actualizados en el archivo productos-usuario.json
    return this.http.put(this.baseUrl, { productos: nuevosDatos }, {responseType: 'text'}).pipe(
      map((res: any) => {
        // Los datos actualizados están en 'res'
        const datosActualizados = res;
    
        // Imprime un mensaje en la consola para verificar que los datos se guardaron
        console.log('Los datos se guardaron correctamente en el servidor. Datos:', datosActualizados);
        return nuevosDatos;
      }),
      catchError(error => {
        console.error('Hubo un error al guardar los datos en el servidor:', error);
        return throwError(error);
      })
    );
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
