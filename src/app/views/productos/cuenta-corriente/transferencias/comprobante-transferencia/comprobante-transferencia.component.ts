import { Component, OnInit } from '@angular/core';

// Services
import { ProductosUsuarioService } from '../../../../../core/services/productos-usuario.service';
import { DatosUsuarioService } from '../../../../../core/services/datos-usuario.service';
import { AgendaDestinatariosService } from '../../../../../core/services/agenda-destinatarios.service';

// Models
import { DatosUsuarioActual } from '../../../../../shared/models/datos-usuario.model';
import { Destinatario } from '../../../../../shared/models/destinatarios.model';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-comprobante-transferencia',
  templateUrl: './comprobante-transferencia.component.html'
})
export class ComprobanteTransferenciaComponent implements OnInit{

  datosUsuarioActual: DatosUsuarioActual | undefined;
  email: string | undefined;
  // datosDestinatario: any;

  productosUsuario: { productos: any[] } = { productos: [] };
  cargo: any;

  datosTransferenciaDestinatario: Destinatario | undefined;
  destinatarioId: any;
  nombreDestinatario: any;
  emailDestinatario: any;

  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private productosUsuarioService: ProductosUsuarioService,
    private agendaService: AgendaDestinatariosService
  ) { }

  ngOnInit() {
    this.getDatosUsuario();
    this.getProductosUsuarioResumen('0');
    this.getDatosTransferenciaDestinatario().subscribe();
    // const ultimoIdDestinatario = this.agendaService.getUltimoIdDestinatario();
  }

  getDatosUsuario(): void {
    this.datosUsuarioService.getDatosUsuario().subscribe(data => {
      this.datosUsuarioActual = data;
      this.email = this.datosUsuarioActual.datosUsuario.email;
    });
  }

  getProductosUsuarioResumen(id: any): void {
    this.productosUsuarioService.getProductosUsuarioResumen(id).subscribe(
      data => {
        const producto = data.productos.find(producto => producto.id === '0');
        if (producto) {
          const ultimaTransaccion = producto.transacciones[producto.transacciones.length - 1];
          if (ultimaTransaccion) {
            this.cargo = parseFloat(ultimaTransaccion.cargo);
            console.log(this.cargo);
          }
        }
      }
    );
  }

  getDatosTransferenciaDestinatario(): Observable<Destinatario> {
    const id = this.agendaService.getUltimoIdDestinatario();
    return this.agendaService.getDestinatarioPorId(id).pipe(
      tap((destinatario: Destinatario) => {
        if (destinatario) { // Verifica que destinatario no es undefined
          this.nombreDestinatario = destinatario.nombre;
          this.emailDestinatario = destinatario.email;
          console.log('Nombre del destinatario:', this.nombreDestinatario);
          console.log('Email del destinatario:', this.emailDestinatario);
        }
      })
    );
  }

}
