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


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'mibanco', component: MainComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: ResumenUsuarioComponent },
      { path: 'transacciones', component: TransaccionesComponent },
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