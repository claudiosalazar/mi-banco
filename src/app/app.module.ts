import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { MiBancoComponent } from './mi-banco.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';


import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ResumenUsuarioComponent } from './components/main/resumen-usuario/resumen-usuario.component';
import { TransaccionesComponent } from './components/main/transacciones/transacciones.component';
import { ContactanosComponent } from './components/main/contactanos/contactanos.component';

import { HttpClientModule } from '@angular/common/http';

import { DatosUsuarioService } from './services/datos-usuario.service';
import { PesosPipe } from './pipe/pesos.pipe';
import { DatosUsuarioComponent } from './components/main/datos-usuario/datos-usuario.component';
import { CuentaCorrienteComponent } from './components/main/transacciones/cuenta-corriente/cuenta-corriente.component';
import { LineaCreditoComponent } from './components/main/transacciones/linea-credito/linea-credito.component';
import { VisaComponent } from './components/main/transacciones/visa/visa.component';
import { TransaccionesResumenComponent } from './components/main/transacciones/transacciones-resumen/transacciones-resumen.component';
import { SegurosComponent } from './components/main/seguros/seguros.component';
import { SegurosResumenComponent } from './components/main/seguros/seguros-resumen/seguros-resumen.component';
import { SegurosContratarComponent } from './components/main/seguros/seguros-contratar/seguros-contratar.component';
import { AyudaComponent } from './components/main/ayuda/ayuda.component';
import { LineaCreditoPagoComponent } from './components/main/transacciones/linea-credito/linea-credito-pago/linea-credito-pago.component';
import { LineaCreditoComprobanteComponent } from './components/main/transacciones/linea-credito/linea-credito-comprobante/linea-credito-comprobante.component';
import { VisaPagoComponent } from './components/main/transacciones/visa/visa-pago/visa-pago.component';

@NgModule({
  declarations: [
    MiBancoComponent,
    LoginComponent,
    MainComponent,
    HeaderComponent,
    FooterComponent,
    ResumenUsuarioComponent,
    TransaccionesComponent,
    ContactanosComponent,
    PesosPipe,
    DatosUsuarioComponent,
    CuentaCorrienteComponent,
    LineaCreditoComponent,
    VisaComponent,
    TransaccionesResumenComponent,
    SegurosComponent,
    SegurosResumenComponent,
    SegurosContratarComponent,
    AyudaComponent,
    LineaCreditoPagoComponent,
    LineaCreditoComprobanteComponent,
    VisaPagoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [DatosUsuarioService],
  bootstrap: [MiBancoComponent]
})
export class AppModule { }
