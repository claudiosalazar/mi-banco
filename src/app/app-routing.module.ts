import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { MainComponent } from './shared/components/main/main.component';
import { AuthGuard } from './auth/class/auth.guard';
import { AyudaComponent } from './views/ayuda/ayuda.component';
import { ResumenUsuarioComponent } from './views/resumen-usuario/resumen-usuario.component';
import { ProductosComponent } from './views/productos/productos.component';
import { DatosUsuarioComponent } from './views/datos-usuario/datos-usuario.component';
import { CuentaCorrienteComponent } from './views/productos/cuenta-corriente/cuenta-corriente.component';
import { MovimientosComponent } from './views/productos/cuenta-corriente/movimientos/movimientos.component';
import { TransferenciasComponent } from './views/productos/cuenta-corriente/transferencias/transferencias.component';
import { UltimasTransferenciasComponent } from './views/productos/cuenta-corriente/transferencias/ultimas-transferencias/ultimas-transferencias.component';
import { AgendaDestinatariosComponent } from './views/productos/cuenta-corriente/transferencias/agenda-destinatarios/agenda-destinatarios.component';
import { AgregarDestinatarioComponent } from './views/productos/cuenta-corriente/transferencias/agregar-destinatario/agregar-destinatario.component';
import { EditarDestinatarioComponent } from './views/productos/cuenta-corriente/transferencias/editar-destinatario/editar-destinatario.component';
import { ComprobanteTransferenciaComponent } from './views/productos/cuenta-corriente/transferencias/comprobante-transferencia/comprobante-transferencia.component';
import { TransferenciaATercerosComponent } from './views/productos/cuenta-corriente/transferencias/transferencia-a-terceros/transferencia-a-terceros.component';
import { CartolaHistoricaComponent } from './views/productos/cuenta-corriente/cartola-historica/cartola-historica.component';
import { LineaCreditoComponent } from './views/productos/linea-credito/linea-credito.component';
import { LineaCreditoPagoComponent } from './views/productos/linea-credito/linea-credito-pago/linea-credito-pago.component';
import { LineaCreditoComprobanteComponent } from './views/productos/linea-credito/linea-credito-comprobante/linea-credito-comprobante.component';
import { VisaComponent } from './views/productos/visa/visa.component';
import { VisaPagoComponent } from './views/productos/visa/visa-pago/visa-pago.component';
import { VisaComprobanteComponent } from './views/productos/visa/visa-comprobante/visa-comprobante.component';
import { TransaccionesResumenComponent } from './views/productos/transacciones-resumen/transacciones-resumen.component';
import { SegurosComponent } from './views/productos/seguros/seguros.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'mibanco', component: MainComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: ResumenUsuarioComponent },
      { 
        path: 'productos', component: ProductosComponent, canActivate: [AuthGuard],
        children: [
          { path: 'resumen', component: TransaccionesResumenComponent },
          { path: 'cuenta-corriente', component: CuentaCorrienteComponent,
            children: [
              { path: '', pathMatch: 'full', redirectTo: 'ultimos-movimientos'},
              { path: 'ultimos-movimientos', component: MovimientosComponent },
              { path: 'transferencias', component: TransferenciasComponent,
                children: [
                  { path: '', pathMatch: 'full', redirectTo: 'transferencia-a-terceros'},
                  { path: 'transferencia-a-terceros', component: TransferenciaATercerosComponent},
                  { path: 'ultimas-transferencias', component: UltimasTransferenciasComponent},
                  { path: 'agenda-destinatarios', component: AgendaDestinatariosComponent},
                  { path: 'agregar-destinatario', component: AgregarDestinatarioComponent},
                  { path: 'editar-destinatario', component: EditarDestinatarioComponent},
                ]
              },
              { path: 'cartola-historica', component: CartolaHistoricaComponent },
            ]
          },
          { path: 'cuenta-corriente/comprobante-transferencia', component: ComprobanteTransferenciaComponent},
          { path: 'linea-credito', component: LineaCreditoComponent },
          { path: 'linea-credito/pago', component: LineaCreditoPagoComponent },
          { path: 'linea-credito/comprobante', component: LineaCreditoComprobanteComponent },
          { path: 'visa', component: VisaComponent },
          { path: 'visa/pago', component: VisaPagoComponent },
          { path: 'visa/comprobante', component: VisaComprobanteComponent },
          { path: 'seguros', component: SegurosComponent },
        ]
      },
      { path: 'mis-datos', component: DatosUsuarioComponent },
      { path: 'ayuda/:id', component: AyudaComponent }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }