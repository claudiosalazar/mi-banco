import { NgModule } from '@angular/core';

// Modules
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';

// Pipe
import { DatePipe } from '@angular/common';
import { PesosPipe } from './shared/pipes/pesos.pipe';
import { RutPipe } from './shared/pipes/rut.pipe';
import { CelularPipe } from './shared/pipes/celular.pipe';
import { TelefonoFijoPipe } from './shared/pipes/telefono-fijo.pipe';
import { NumeroTarjetaPipe } from './shared/pipes/numero-tarjeta.pipe';

// Components
import { MiBancoComponent } from './mi-banco.component';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { PrivateComponent } from './components/private/private.component';
import { HomeComponent } from './components/home/home.component';




@NgModule({
  declarations: [
    MiBancoComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    PrivateComponent,
    HomeComponent,
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
