import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms'
import { Subscription } from 'rxjs';

// Productos usuario
import { ProductosUsuarioService } from '../../../core/services/productos-usuario.service';
import { UrlBrowserService } from '../../../core/services/url-browser.service';

@Component({
  selector: 'app-linea-credito',
  templateUrl: './linea-credito.component.html'
})
export class LineaCreditoComponent implements OnInit {

  transaccionesLineaCredito = '1';
  
  // Captura datos de nodo desde cualquier ID
  transacciones: any[] | undefined;
  productos: any[] = [];
  originalData: any[] = [];
  itemsPerPage = 5;
  currentPage = 1;
  paginatedData: any[] | undefined;
  totalPages: any;

  // Variables para productos
  productosUsuario: { productos: any[] } = { productos: [] };
  fechaUltimoAbono: any;
  ultimoMontoAbono: any;
  numeroProducto: any;

  // Variables para buscador
  campoBusqueda = new FormControl('');
  mostrarPaginador: boolean | undefined;

  // Componentes a mostrar
  movimientosLineaDeCredito = true;
  formularioPagoLineaDeCredito = false;
  comprobantePagoLineaDeCredito = false;

  private subscription: Subscription = new Subscription();

  constructor(
    private productosUsuarioService: ProductosUsuarioService,
    private urlBrowserService: UrlBrowserService
  ) { }

  ngOnInit(): void {
    this.getProductosUsuarioResumen('');
    this.subscription = this.productosUsuarioService.datosGuardados.subscribe(() => {
      setTimeout(() => {
        this.movimientosLineaDeCredito = false;
        this.formularioPagoLineaDeCredito = false;
        this.comprobantePagoLineaDeCredito = true;
      }, 1500);
    });
  }

  // Evitar fugas de memoria
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getProductosUsuarioResumen(id: string): void {
    this.productosUsuarioService.getProductosUsuarioResumen(id).subscribe(data => {
      this.productosUsuario = data.productos ? { productos: data.productos } : { productos: [] };
      
      const transacciones = this.productosUsuario.productos[1]?.transacciones;
      let ultimaTransaccionConAbono;
  
      if (transacciones) {
        for (let i = transacciones.length - 1; i >= 0; i--) {
          if (transacciones[i].abono > 0) {
            ultimaTransaccionConAbono = transacciones[i];
            break;
          }
        }
      }
  
      if (ultimaTransaccionConAbono) {
        this.fechaUltimoAbono = ultimaTransaccionConAbono.fecha;
        this.ultimoMontoAbono = ultimaTransaccionConAbono.abono;
      }

      this.numeroProducto = this.productosUsuario.productos[1]?.productoNumero;
    });
  }

  handleDatosFiltrados(datosFiltrados: any[]) {
    this.transacciones = datosFiltrados;
    this.productos = [...this.transacciones];
    this.originalData = [...this.transacciones];
    this.totalPages = Math.ceil(this.transacciones.length / this.itemsPerPage);
  }

  mostrarInicioLineaDeCredito(): void {
    this.movimientosLineaDeCredito = true;
    this.formularioPagoLineaDeCredito = false;
    this.comprobantePagoLineaDeCredito = false;

    this.urlBrowserService.navegarAInicioLineaDeCredito();
  }

  mostrarPagoLineaDeCredito(): void {
    this.movimientosLineaDeCredito = false;
    this.formularioPagoLineaDeCredito = true;
    this.comprobantePagoLineaDeCredito = false;

    this.urlBrowserService.navegarAPagoLineaDeCredito();
  }
}
