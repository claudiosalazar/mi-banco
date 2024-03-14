import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { MainComponent } from './shared/components/main/main.component';
import { AuthGuard } from './auth/class/auth.guard';
import { AyudaComponent } from './views/ayuda/ayuda.component';
import { ResumenUsuarioComponent } from './views/resumen-usuario/resumen-usuario.component';
import { ProductosComponent } from './views/productos/productos.component';
import { ContactanosComponent } from './views/contactanos/contactanos.component';
import { DatosUsuarioComponent } from './views/datos-usuario/datos-usuario.component';
import { CuentaCorrienteComponent } from './views/productos/cuenta-corriente/cuenta-corriente.component';
import { LineaCreditoComponent } from './views/productos/linea-credito/linea-credito.component';
import { LineaCreditoPagoComponent } from './views/productos/linea-credito/linea-credito-pago/linea-credito-pago.component';
import { LineaCreditoComprobanteComponent } from './views/productos/linea-credito/linea-credito-comprobante/linea-credito-comprobante.component';
import { VisaComponent } from './views/productos/visa/visa.component';
import { VisaPagoComponent } from './views/productos/visa/visa-pago/visa-pago.component';
import { VisaComprobanteComponent } from './views/productos/visa/visa-comprobante/visa-comprobante.component';
import { TransaccionesResumenComponent } from './views/productos/transacciones-resumen/transacciones-resumen.component';
import { SegurosComponent } from './views/seguros/seguros.component';
import { SegurosResumenComponent } from './views/seguros/seguros-resumen/seguros-resumen.component';
import { SegurosContratarComponent } from './views/seguros/seguros-contratar/seguros-contratar.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'mibanco', component: MainComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: ResumenUsuarioComponent },
      { 
        path: 'transacciones', component: ProductosComponent, canActivate: [AuthGuard],
        children: [
          { path: 'resumen', component: TransaccionesResumenComponent },
          { path: 'cuenta-corriente', component: CuentaCorrienteComponent },
          { path: 'linea-credito', component: LineaCreditoComponent },
          { path: 'linea-credito/pago', component: LineaCreditoPagoComponent },
          { path: 'comprobante-pago', component: LineaCreditoComprobanteComponent },
          { path: 'visa', component: VisaComponent },
          { path: 'visa/pago', component: VisaPagoComponent },
          { path: 'visa/comprobante', component: VisaComprobanteComponent },
        ]
      },
      { 
        path: 'seguros', component: SegurosComponent, canActivate: [AuthGuard],
        children: [
          { path: 'resumen', component: SegurosResumenComponent },
          { path: 'contratar-seguro', component: SegurosContratarComponent },
        ]
      },
      { path: 'contactanos', component: ContactanosComponent },
      { path: 'mis-datos', component: DatosUsuarioComponent },
      { path: 'ayuda/:id', component: AyudaComponent }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }