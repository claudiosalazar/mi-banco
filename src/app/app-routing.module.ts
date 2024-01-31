import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { AuthGuard } from './auth.guard';
import { AyudaComponent } from './components/main/ayuda/ayuda.component';
import { ResumenUsuarioComponent } from './components/main/resumen-usuario/resumen-usuario.component';
import { TransaccionesComponent } from './components/main/transacciones/transacciones.component';
import { ContactanosComponent } from './components/main/contactanos/contactanos.component';
import { DatosUsuarioComponent } from './components/main/datos-usuario/datos-usuario.component';
import { CuentaCorrienteComponent } from './components/main/transacciones/cuenta-corriente/cuenta-corriente.component';
import { LineaCreditoComponent } from './components/main/transacciones/linea-credito/linea-credito.component';
import { LineaCreditoPagoComponent } from './components/main/transacciones/linea-credito/linea-credito-pago/linea-credito-pago.component';
import { LineaCreditoComprobanteComponent } from './components/main/transacciones/linea-credito/linea-credito-comprobante/linea-credito-comprobante.component';
import { VisaComponent } from './components/main/transacciones/visa/visa.component';
import { TransaccionesResumenComponent } from './components/main/transacciones/transacciones-resumen/transacciones-resumen.component';
import { SegurosComponent } from './components/main/seguros/seguros.component';
import { SegurosResumenComponent } from './components/main/seguros/seguros-resumen/seguros-resumen.component';
import { SegurosContratarComponent } from './components/main/seguros/seguros-contratar/seguros-contratar.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'mibanco', component: MainComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: ResumenUsuarioComponent },
      { 
        path: 'transacciones', component: TransaccionesComponent, canActivate: [AuthGuard],
        children: [
          { path: 'resumen', component: TransaccionesResumenComponent },
          { path: 'cuenta-corriente', component: CuentaCorrienteComponent },
          { path: 'linea-credito', component: LineaCreditoComponent },
          { path: 'linea-credito/pago', component: LineaCreditoPagoComponent },
          { path: 'comprobante-pago', component: LineaCreditoComprobanteComponent },
          { path: 'visa', component: VisaComponent },
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