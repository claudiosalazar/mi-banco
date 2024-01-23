import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';

import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ResumenUsuarioComponent } from './components/main/resumen-usuario/resumen-usuario.component';
import { TransaccionesComponent } from './components/main/transacciones/transacciones.component';
import { ContactanosComponent } from './components/main/contactanos/contactanos.component';

import { HttpClientModule } from '@angular/common/http';

import { DatosUsuarioService } from './services/datos-usuario.service';
import { PesosPipe } from './pipe/pesos.pipe';
import { RangosPipe } from './pipe/rangos.pipe';
import { DatosUsuarioComponent } from './components/main/datos-usuario/datos-usuario.component';
import { EmergenciasComponent } from './components/main/emergencias/emergencias.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { CuentaCorrienteComponent } from './components/main/transacciones/cuenta-corriente/cuenta-corriente.component';
import { LineaCreditoComponent } from './components/main/transacciones/linea-credito/linea-credito.component';
import { VisaComponent } from './components/main/transacciones/visa/visa.component';
import { TransaccionesResumenComponent } from './components/main/transacciones/transacciones-resumen/transacciones-resumen.component';

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
    PesosPipe,
    RangosPipe,
    DatosUsuarioComponent,
    EmergenciasComponent,
    BreadcrumbComponent,
    CuentaCorrienteComponent,
    LineaCreditoComponent,
    VisaComponent,
    TransaccionesResumenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [DatosUsuarioService],
  bootstrap: [AppComponent]
})
export class AppModule { }
