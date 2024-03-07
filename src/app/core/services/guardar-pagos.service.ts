import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ProductosUsuario } from '../../shared/models/productos-usuario.model';
import { ProductosUsuarioService } from './productos-usuario.service';

@Injectable({
  providedIn: 'root'
})

export class GuardaPagoProductosService {

  private baseUrl = 'http://localhost:3000/backend/data/productos-usuario.json';
  productosUsuario: { productos: any[] } = { productos: [] };
  montoPagado: any;
  
  constructor(
    private http: HttpClient,
    private productosUsuarioService: ProductosUsuarioService
  ) { }

  putPagoVisa(montoPagado: any, cupoVisa: any, cupoDisponibleVisa: any, cupoCtaCte: any, cupoLineaCredito: any) {
    const fechaActual = new Date().toISOString();
    console.log('Datos capturados desde el formulario:');
    console.log('Cupo Visa:', cupoVisa);
    console.log('Cupo Disponible Visa:', cupoDisponibleVisa);
    console.log('Cupo Cta Cte:', cupoCtaCte);
    console.log('Cupo Línea de Crédito:', cupoLineaCredito);
  }

  /*
  getProductosUsuario(): void {
    this.http.get(this.baseUrl, {responseType: 'text'}).subscribe(data => {
      console.log('Respuesta del servidor:', data);
      try {
        const productosUsuario = JSON.parse(data) as ProductosUsuario;
        console.log('ProductosUsuario:', productosUsuario);
  
        // Imprimir la estructura de los datos
        console.log('Estructura de los datos:', Object.keys(productosUsuario));
  
        // Si productosUsuario tiene una propiedad 'productos', imprimir la estructura de un producto
        if (productosUsuario.productos && productosUsuario.productos.length > 0) {
          console.log('Estructura de un producto:', Object.keys(productosUsuario.productos[0]));
        }
  
      } catch (error) {
        console.error('Error al analizar la respuesta del servidor:', error);
      }
    });
  }

  putPagoVisa(_montoPagado: any, cupoVisa: any, cupoDisponibleVisa: any, cupoCtaCte: any, cupoLineaCredito: any): void {
    console.log('Datos capturados desde el formulario:');
    console.log('Cupo Visa:', cupoVisa);
    console.log('Cupo Disponible Visa:', cupoDisponibleVisa);
    console.log('Cupo Cta Cte:', cupoCtaCte);
    console.log('Cupo Línea de Crédito:', cupoLineaCredito);

    const fechaActual = new Date().toISOString();

    // Actualizar producto con ID 2
    const productoVisa = this.productosUsuario.productos.find(producto => producto.id === '2');
    if (productoVisa) {
      productoVisa.transacciones.push({
        fecha: fechaActual,
        detalle: 'Abono a Visa',
        cargo: '',
        abono: this.montoPagado,
        saldo: this.productosUsuarioService.calculosMontos(productoVisa)
      });
      productoVisa.cupoDisponible = cupoDisponibleVisa;
    }

    // Actualizar producto con ID 0 si cupoCtaCte ha cambiado
    if (cupoCtaCte) {
      const productoCtaCte = this.productosUsuario.productos.find(producto => producto.id === '0');
      if (productoCtaCte) {
        productoCtaCte.transacciones.push({
          fecha: fechaActual,
          detalle: 'Cargo por pago en Visa',
          cargo: cupoCtaCte,
          abono: '',
          saldo: this.productosUsuarioService.calculosMontos(productoCtaCte)
        });
      }
    }

    // Actualizar producto con ID 1 si cupoLineaCredito ha cambiado
    if (cupoLineaCredito) {
      const productoLineaCredito = this.productosUsuario.productos.find(producto => producto.id === '1');
      if (productoLineaCredito) {
        productoLineaCredito.transacciones.push({
          fecha: fechaActual,
          detalle: 'Cargo por pago en Visa',
          cargo: cupoLineaCredito,
          abono: '',
          saldo: this.productosUsuarioService.calculosMontos(productoLineaCredito)
        });
      }
    }

    const productosActualizados = { productos: this.productosUsuario.productos };

    // Hacer una petición PUT al servidor con los datos que deseas guardar
    this.http.put(this.baseUrl, productosActualizados).subscribe((res: any) => {
      // Los datos actualizados están en 'res'
      const datosActualizados = res;
      console.log('Datos guardados correctamente:', datosActualizados);
      console.log('Respuesta completa del servidor:', res);
  
      // Después de la petición PUT, llamar al método getProductosUsuario para obtener y analizar los datos
      this.getProductosUsuario();
  
    }, (error: HttpErrorResponse) => {
      console.log('Hubo un error al guardar los datos:', error);
      console.log('Detalles del error:', error.error);
      console.log('Estado del error:', error.status);
      console.log('Mensaje del error:', error.message);
    });
  }
  
*/
  


}