import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';

import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ResumenUsuarioComponent } from './components/resumen-usuario/resumen-usuario.component';
import { TransaccionesComponent } from './components/transacciones/transacciones.component';
import { ContactanosComponent } from './components/contactanos/contactanos.component';

import { HttpClientModule } from '@angular/common/http';

import { DatosInicioService } from './services/datos-inicio.service';
import { PesosPipe } from './pipe/pesos.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    HeaderComponent,
    FooterComponent,
    ResumenUsuarioComponent,
    TransaccionesComponent,
    ContactanosComponent,
    PesosPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [DatosInicioService],
  bootstrap: [AppComponent]
})
export class AppModule { }
