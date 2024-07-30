import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { MiBancoComponent } from './mi-banco.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { PrivateComponent } from './components/private/private.component';

// Pipe
import { DatePipe } from '@angular/common';
import { PesosPipe } from './shared/pipes/pesos.pipe';
import { RutPipe } from './shared/pipes/rut.pipe';
import { CelularPipe } from './shared/pipes/celular.pipe';
import { TelefonoFijoPipe } from './shared/pipes/telefono-fijo.pipe';
import { NumeroTarjetaPipe } from './shared/pipes/numero-tarjeta.pipe';

// Modules
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';


@NgModule({
  declarations: [
    MiBancoComponent,
    LoginComponent,
    HomeComponent,
    PrivateComponent,
    PesosPipe,
    RutPipe,
    CelularPipe,
    TelefonoFijoPipe,
    NumeroTarjetaPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    {provide: JWT_OPTIONS, useValue: JWT_OPTIONS},
    JwtHelperService,
    PesosPipe,
    RutPipe,
    CelularPipe,
    TelefonoFijoPipe,
    DatePipe,
    NumeroTarjetaPipe
  ],
  bootstrap: [MiBancoComponent]
})
export class AppModule { }
