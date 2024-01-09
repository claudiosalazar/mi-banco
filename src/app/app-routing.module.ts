import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { AuthGuard } from './auth.guard';
import { ResumenUsuarioComponent } from './components/resumen-usuario/resumen-usuario.component';
import { TransaccionesComponent } from './components/transacciones/transacciones.component';
import { ContactanosComponent } from './components/contactanos/contactanos.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'mibanco', component: MainComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: ResumenUsuarioComponent },
      { path: 'transacciones', component: TransaccionesComponent },
      { path: 'contactanos', component: ContactanosComponent },
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }