import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PrivateComponent } from './components/private/private.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './components/private/views/home/home.component';
import { ProductosComponent } from './components/private/views/productos/productos.component';
import { TransferenciasComponent } from './components/private/views/productos/cuenta-corriente/transferencias/transferencias.component';
import { MovimientosComponent } from './components/private/views/productos/cuenta-corriente/movimientos/movimientos.component';
import { TransferenciaATercerosComponent } from './components/private/views/productos/cuenta-corriente/transferencias/transferencia-a-terceros/transferencia-a-terceros.component';
import { UltimasTransferenciasComponent } from './components/private/views/productos/cuenta-corriente/transferencias/ultimas-transferencias/ultimas-transferencias.component';
import { AgendaDestinatariosComponent } from './components/private/views/productos/cuenta-corriente/transferencias/agenda/agenda-destinatarios.component';
import { AgregarDestinatarioComponent } from './components/private/views/productos/cuenta-corriente/transferencias/agenda/agregar-destinatario/agregar-destinatario.component';
import { EditarDestinatarioComponent } from './components/private/views/productos/cuenta-corriente/transferencias/agenda/editar-destinatario/editar-destinatario.component';
import { CuentaCorrienteComponent } from './components/private/views/productos/cuenta-corriente/cuenta-corriente.component';
import { CartolaHistoricaComponent } from './components/private/views/productos/cuenta-corriente/cartola-historica/cartola-historica.component';
import { ComprobanteTransferenciaComponent } from './components/private/views/productos/cuenta-corriente/transferencias/comprobante-transferencia/comprobante-transferencia.component';
import { TransaccionesResumenComponent } from './components/private/views/productos/transacciones-resumen/transacciones-resumen.component';
import { LineaCreditoComponent } from './components/private/views/productos/linea-credito/linea-credito.component';
import { VisaComponent } from './components/private/views/productos/visa/visa.component';
import { SegurosComponent } from './components/private/views/productos/seguros/seguros.component';
import { LineaCreditoPagoComponent } from './components/private/views/productos/linea-credito/linea-credito-pago/linea-credito-pago.component';
import { LineaCreditoComprobanteComponent } from './components/private/views/productos/linea-credito/linea-credito-comprobante/linea-credito-comprobante.component';
import { VisaPagoComponent } from './components/private/views/productos/visa/visa-pago/visa-pago.component';
import { VisaComprobanteComponent } from './components/private/views/productos/visa/visa-comprobante/visa-comprobante.component';
import { AyudaComponent } from './components/private/views/ayuda/ayuda.component';
import { DatosUsuarioComponent } from './components/private/views/datos-usuario/datos-usuario.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', pathMatch: 'full', redirectTo: '' },
  { path: 'mibanco', component: PrivateComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeComponent, canActivate: [AuthGuard] },
      { path: 'productos', component: ProductosComponent, canActivate: [AuthGuard],
        children: [
          { path: 'resumen', component: TransaccionesResumenComponent, canActivate: [AuthGuard] },
          { path: 'cuenta-corriente', component: CuentaCorrienteComponent, canActivate: [AuthGuard],
            children: [
              { path: '', pathMatch: 'full', redirectTo: 'ultimos-movimientos'},
              { path: 'ultimos-movimientos', component: MovimientosComponent, canActivate: [AuthGuard] },
              { path: 'transferencias', component: TransferenciasComponent, canActivate: [AuthGuard],
                children: [
                  { path: '', pathMatch: 'full', redirectTo: 'transferencia-a-terceros'},
                  { path: 'transferencia-a-terceros', component: TransferenciaATercerosComponent, canActivate: [AuthGuard]},
                  { path: 'ultimas-transferencias', component: UltimasTransferenciasComponent, canActivate: [AuthGuard]},
                  { path: 'agenda-destinatarios', component: AgendaDestinatariosComponent, canActivate: [AuthGuard]},
                  { path: 'agregar-destinatario', component: AgregarDestinatarioComponent, canActivate: [AuthGuard]},
                  { path: 'editar-destinatario', component: EditarDestinatarioComponent, canActivate: [AuthGuard]},
                ]
              },
              { path: 'cartola-historica', component: CartolaHistoricaComponent },
            ]
          },
          { path: 'cuenta-corriente/comprobante-transferencia', component: ComprobanteTransferenciaComponent, canActivate: [AuthGuard]},
        ]
      },
      { path: 'linea-credito', component: LineaCreditoComponent, canActivate: [AuthGuard],
        children: [
          { path: 'pago', component: LineaCreditoPagoComponent, canActivate: [AuthGuard]},
          { path: 'comprobante', component: LineaCreditoComprobanteComponent, canActivate: [AuthGuard]},
        ]
      },
      { path: 'visa', component: VisaComponent, canActivate: [AuthGuard],
        children: [
          { path: 'pago', component: VisaPagoComponent, canActivate: [AuthGuard]},
          { path: 'comprobante', component: VisaComprobanteComponent, canActivate: [AuthGuard]},
        ]
      },
      { path: 'seguros', component: SegurosComponent, canActivate: [AuthGuard]},
      { path: 'ayuda', component: AyudaComponent, canActivate: [AuthGuard]},
      { path: 'datos-usuario', component: DatosUsuarioComponent, canActivate: [AuthGuard]},
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }