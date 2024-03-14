import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms'
// Productos usuario
import { ProductosUsuarioService } from '../../../core/services/productos-usuario.service';
import { Subscription } from 'rxjs';
import { UrlBrowserService } from '../../../core/services/url-browser.service';
@Component({
  selector: 'app-visa',
  templateUrl: './visa.component.html'
})
export class VisaComponent implements OnInit {
   
  transaccionesVisa = '2';
  
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

  // Variables para buscador
  campoBusqueda = new FormControl('');
  mostrarPaginador: boolean | undefined;

  // Componentes a mostrar
  movimientosVisa = true;
  formularioPagoVisa = false;
  comprobantePagoVisa = false;

  private subscription: Subscription = new Subscription();

  constructor(
    private productosUsuarioService: ProductosUsuarioService,
    private urlBrowserService: UrlBrowserService
  ) { }

  ngOnInit(): void {
    this.getProductosUsuarioResumen('');
    this.subscription = this.productosUsuarioService.datosGuardados.subscribe(() => {
      setTimeout(() => {
        this.movimientosVisa = false;
        this.formularioPagoVisa = false;
        this.comprobantePagoVisa = true;
      }, 1500);
    });
  }

  ngOnDestroy(): void {
    // Asegúrate de desuscribirte para evitar fugas de memoria
    this.subscription.unsubscribe();
  }

  getProductosUsuarioResumen(id: string): void {
    this.productosUsuarioService.getProductosUsuarioResumen(id).subscribe(data => {
      this.productosUsuario = data.productos ? { productos: data.productos } : { productos: [] };
      
      const transacciones = this.productosUsuario.productos[2]?.transacciones;
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
    });
  }

  handleDatosFiltrados(datosFiltrados: any[]) {
    this.transacciones = datosFiltrados;
    this.productos = [...this.transacciones];
    this.originalData = [...this.transacciones];
    this.totalPages = Math.ceil(this.transacciones.length / this.itemsPerPage);
  }

  mostrarInicioVisa(): void {
    this.movimientosVisa = true;
    this.formularioPagoVisa = false;
    this.comprobantePagoVisa = false;

    this.urlBrowserService.navegarAInicioVisa();
  }

  mostrarPagoVisa(): void {
    this.movimientosVisa = false;
    this.formularioPagoVisa = true;
    this.comprobantePagoVisa = false;

    this.urlBrowserService.navegarAPagoVisa();
  }

}
