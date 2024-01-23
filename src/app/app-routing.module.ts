import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { AuthGuard } from './auth.guard';
import { ResumenUsuarioComponent } from './components/main/resumen-usuario/resumen-usuario.component';
import { TransaccionesComponent } from './components/main/transacciones/transacciones.component';
import { ContactanosComponent } from './components/main/contactanos/contactanos.component';
import { DatosUsuarioComponent } from './components/main/datos-usuario/datos-usuario.component';
import { EmergenciasComponent } from './components/main/emergencias/emergencias.component';
import { CuentaCorrienteComponent } from './components/main/transacciones/cuenta-corriente/cuenta-corriente.component';
import { LineaCreditoComponent } from './components/main/transacciones/linea-credito/linea-credito.component';
import { VisaComponent } from './components/main/transacciones/visa/visa.component';
import { TransaccionesResumenComponent } from './components/main/transacciones/transacciones-resumen/transacciones-resumen.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'mibanco', component: MainComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: ResumenUsuarioComponent },
      { 
        path: 'transacciones', component: TransaccionesComponent, canActivate: [AuthGuard],
        children: [
          { path: '', component: TransaccionesResumenComponent },
          { path: 'cuenta-corriente', component: CuentaCorrienteComponent },
          { path: 'linea-credito', component: LineaCreditoComponent },
          { path: 'visa', component: VisaComponent },
        ]
      },
      { path: 'contactanos', component: ContactanosComponent },
      { path: 'mis-datos', component: DatosUsuarioComponent },
      { path: 'emergencias', component: EmergenciasComponent }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }