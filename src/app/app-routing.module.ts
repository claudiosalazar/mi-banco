import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PrivateComponent } from './components/private/private.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { ProductosComponent } from './components/private/views/productos/productos.component';
import { TransferenciasComponent } from './components/private/views/transferencias/transferencias.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', pathMatch: 'full', redirectTo: '' },
  { path: 'mibanco', component: PrivateComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeComponent, canActivate: [AuthGuard] },
      { path: 'transferencias', component: TransferenciasComponent, canActivate: [AuthGuard] },
      { path: 'productos', component: ProductosComponent, canActivate: [AuthGuard] },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
