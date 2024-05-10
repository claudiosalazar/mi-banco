import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, combineLatest, of, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { ProductosUsuario } from '../../shared/models/productos-usuario.model';
import { UrlBrowserService } from './url-browser.service';

@Injectable({
  providedIn: 'root'
})
export class ProductosUsuarioService {

  //private baseUrl = 'http://localhost:3000/backend/data/productos-usuario.json';
  private baseUrl = 'https://www.claudiosalazar.cl/mi-banco/angular/backend/data/productos-usuario.json';
  private datosUsados: any;
  productos: ProductosUsuario['productos'] = [];
  saldo: string | undefined;
  fecha: any;
  destinatario: any;
  cupoDisponibleVisa: Number | undefined;
  nuevosDatos: any;
  nuevosDatosPago: any;
  datos: any;
  datosTransaccion: any;
  datosTransaccionActualizados: any;
  datosTransaccionCalculos: any;
  // Codigo para buscador
  private idActual = new BehaviorSubject<string>('');
  private datosPagoVisa = new BehaviorSubject<any>(null);
  private datosPagoLineaCredito = new BehaviorSubject<any>(null);
  private datosTransferencia = new BehaviorSubject<any>(null);
  private productosActualizados = new BehaviorSubject<ProductosUsuario['productos']>([]);
  datosGuardados = new Subject<void>();
  
  constructor(
    private http: HttpClient,
    private urlBrowserService: UrlBrowserService
  ) {
    this.http.get(this.baseUrl).subscribe((data: any) => {
      if (data && data.producto) {
        if (data && Array.isArray(data.productos)) {
          data.productos.forEach((producto: any) => {
            if (producto && producto.transacciones) {
              const nuevoDatos = this.calculosMontos(producto);
              this.guardaResultadosCalculos(nuevoDatos).subscribe();
            }
          });
        }
      }
    });
  }

  getProductosUsuarioResumen(id: string): Observable<ProductosUsuario> {
    const url = `${this.baseUrl}?id=${id}`;
    // console.log('URL de la solicitud:', url);
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
    // console.log('URL de la solicitud:', url);
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
    // console.log('URL de la solicitud:', url);
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
  calculosMontos(_producto: ProductosUsuario['productos']): ProductosUsuario['productos'] {

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
              destinatario: transaccion.destinatario,
              fecha: transaccion.fecha,
              detalle: transaccion.detalle,
              cargo: transaccion.cargo === 0 ? "0" : transaccion.cargo,
              abono: transaccion.abono === 0 ? "0" : transaccion.abono,
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

  // Guarda los datos actualizados en el servidor
  guardaResultadosCalculos(nuevosDatos: ProductosUsuario['productos']): Observable<any> {
    return this.http.put(this.baseUrl, nuevosDatos, {responseType: 'text'}).pipe(
      map((res: any) => {
        const datosActualizados = res;
        return of(nuevosDatos);
      }),
      catchError(error => {
        console.error('Error del server:', error);
        return throwError(error);
      })
    );
  }


  calculosMontosTransaccion(_producto: ProductosUsuario['productos']): any {
    combineLatest([
      this.datosPagoVisa.asObservable(),
      this.datosPagoLineaCredito.asObservable(),
      this.datosTransferencia.asObservable()
    ]).subscribe(([datosPagoVisa, datosPagoLineaCredito, datosTransferencia]) => {
      let datosTransaccionCalculos = datosPagoVisa || datosPagoLineaCredito || datosTransferencia;
      // console.log('datosTransaccionCalculos después de la asignación:', datosTransaccionCalculos);
      if (datosPagoVisa) {
        this.datosUsados = 'Visa';
      } else if (datosPagoLineaCredito) {
        this.datosUsados = 'LineaCredito';
      } else if (datosTransferencia) {
        this.datosUsados = 'Transferencia';
      }
      if (Array.isArray(datosTransaccionCalculos.productos)) {
        
        //console.log('datosTransaccion:', datosTransaccionCalculos);
    
        datosTransaccionCalculos.productos.forEach((producto: {
          cupoDisponible: any; transacciones: any[]; cupo: string; id: any; productoNombre: any; productoNumero: any; }) => {
          
          if (producto.transacciones.length > 1) {
            const ultimaTransaccion = producto.transacciones[producto.transacciones.length - 1];
            const penultimaTransaccion = producto.transacciones[producto.transacciones.length - 2];
      
            if (!ultimaTransaccion.saldo) {
              if (penultimaTransaccion.cargo && !isNaN(parseFloat(ultimaTransaccion.cargo))) {
                ultimaTransaccion.saldo = (parseFloat(penultimaTransaccion.saldo) - parseFloat(ultimaTransaccion.cargo)).toString();
              } else if (ultimaTransaccion.abono && !isNaN(parseFloat(ultimaTransaccion.abono))) {
                ultimaTransaccion.saldo = (parseFloat(penultimaTransaccion.saldo) - parseFloat(ultimaTransaccion.abono)).toString();
              } else {
                console.error('penultimaTransaccion.cargo o penultimaTransaccion.abono no son números');
              }
              console.log(`Nuevo saldo de transacción: ${ultimaTransaccion.saldo} para el producto con id ${producto.id}`);
            }
          }
        });
        //console.log('datosTransaccionCalculos actualizado:', datosTransaccionCalculos);
  
        // Guarda los datos actualizados en datosPago y los envía a otra función
        this.datosTransaccionActualizados = datosTransaccionCalculos;
        this.guardaResultadosCalculosTransaccion(datosTransaccionCalculos);
      }
    });
  }


  guardaResultadosCalculosTransaccion(datosTransaccionCalculos: any): any {
    //console.log('datos para guardar en server', datosTransaccionCalculos);
    //console.log('Guardando datosTransferencia en el servidor:', datosTransaccionCalculos); // Agrega esta línea
    this.http.put(this.baseUrl, datosTransaccionCalculos, {responseType: 'text'}).subscribe(response => {
      console.log('Datos guardados con éxito:', response);
      //console.log('Datos usados:', this.datosUsados); 
      setTimeout(() => {
        if (this.datosUsados === 'Visa') {
          this.urlBrowserService.navegarAComprobanteVisa();
        } else if (this.datosUsados === 'LineaCredito') {
          this.urlBrowserService.navegarAComprobanteLineaCredito();
        } else if (this.datosUsados === 'Transferencia') {
          this.urlBrowserService.navegarAComprobanteTransferencia();
        }
      }, 1500);
    });
  }

  
  // Captura datos de pago visa
  getDatosPagoVisa(datosTransaccion: any): Observable<any> {
    // Verifica si datosPago tiene datos
    if (datosTransaccion) {
      const datosTransaccionJson = JSON.parse(datosTransaccion);
      this.datosPagoVisa.next(datosTransaccionJson);
      this.calculosMontosTransaccion(datosTransaccionJson);
    }
    //console.log('DatosTransferencia:', this.datosPagoVisa);
    return this.datosPagoVisa;
  }

  // Captura datos de pago linea de credito
  getDatosPagoLineaCredito(datosTransaccion: any): Observable<any> {
    // Verifica si datosPago tiene datos
    if (datosTransaccion) {
      const datosTransaccionJson = JSON.parse(datosTransaccion);
      this.datosPagoLineaCredito.next(datosTransaccionJson);
      this.calculosMontosTransaccion(datosTransaccionJson);
    }
    return this.datosPagoLineaCredito;
  }

  getDatosTransferencia(datosTransaccion: any): Observable<any> {
    // Verifica si datosTransaccion tiene datos
    if (datosTransaccion) {
      const datosTransaccionJson = JSON.parse(datosTransaccion);
      console.log('Datos de Transferencia:', datosTransaccionJson);
      this.datosTransferencia.next(datosTransaccionJson);
      this.calculosMontosTransaccion(datosTransaccionJson);
    }
    return this.datosTransferencia;
  }

  // Crea un método para obtener los datos actualizados
  getProductosActualizados(): Observable<ProductosUsuario['productos']> {
    return this.productosActualizados.asObservable();
  }

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

  // Diferencia tipo de transacciones de cuenta corriente
  getTransferenciasCtaCte(): Observable<any[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(response => {
        console.log(response);
        const producto = response.productos.find((producto: { id: string; }) => producto.id === '0');
        if (producto) {
          return producto.transacciones.filter((transaccion: { detalle: string; }) => 
            transaccion.detalle.toLowerCase().includes('transferencia')
          );
        }
        return [];
      })
    );
  }

  buscarTransferencias(valorBusqueda: string): Observable<any[]> {
    return this.getTransferenciasCtaCte().pipe(
      map(transacciones => transacciones.filter((transaccion: { fecha: string; destinatario: string; detalle: string; cargo: string; saldo: string;}) =>
        transaccion.fecha.toLowerCase().includes(valorBusqueda.toLowerCase()) ||
        transaccion.destinatario.toLowerCase().includes(valorBusqueda.toLowerCase()) ||
        transaccion.detalle.toLowerCase().includes(valorBusqueda.toLowerCase()) ||
        transaccion.cargo.toLowerCase().includes(valorBusqueda.toLowerCase()) ||
        transaccion.saldo.toLowerCase().includes(valorBusqueda.toLowerCase()
      ))
    ));
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
