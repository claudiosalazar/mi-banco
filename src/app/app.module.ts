import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Login
import { LoginComponent } from './auth/components/login/login.component';

// Pipe
import { PesosPipe } from './shared/pipes/pesos.pipe';

// Services
import { DatosUsuarioService } from './core/services/datos-usuario.service';
import { DatosFiltradosService } from './core/services/productos-usuario.service';

// Componentes compartidos
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { TablesComponent } from './shared/components/tables/tables.component';
import { BuscadorTablaComponent } from './shared/components/tables/buscador-tabla/buscador-tabla.component';

// Componentes
import { MiBancoComponent } from './mi-banco.component';
import { MainComponent } from './shared/components/main/main.component';
import { ResumenUsuarioComponent } from './views/resumen-usuario/resumen-usuario.component';
import { TransaccionesComponent } from './views/transacciones/transacciones.component';
import { ContactanosComponent } from './views/contactanos/contactanos.component';
import { DatosUsuarioComponent } from './views/datos-usuario/datos-usuario.component';
import { CuentaCorrienteComponent } from './views/transacciones/cuenta-corriente/cuenta-corriente.component';
import { LineaCreditoComponent } from './views/transacciones/linea-credito/linea-credito.component';
import { VisaComponent } from './views/transacciones/visa/visa.component';
import { VisaPagoComponent } from './views/transacciones/visa/visa-pago/visa-pago.component';
import { VisaComprobanteComponent } from './views/transacciones/visa/visa-comprobante/visa-comprobante.component';
import { TransaccionesResumenComponent } from './views/transacciones/transacciones-resumen/transacciones-resumen.component';
import { SegurosComponent } from './views/seguros/seguros.component';
import { SegurosResumenComponent } from './views/seguros/seguros-resumen/seguros-resumen.component';
import { SegurosContratarComponent } from './views/seguros/seguros-contratar/seguros-contratar.component';
import { AyudaComponent } from './views/ayuda/ayuda.component';
import { LineaCreditoPagoComponent } from './views/transacciones/linea-credito/linea-credito-pago/linea-credito-pago.component';
import { LineaCreditoComprobanteComponent } from './views/transacciones/linea-credito/linea-credito-comprobante/linea-credito-comprobante.component';


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
    VisaPagoComponent,
    VisaComprobanteComponent,
    TablesComponent,
    BuscadorTablaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    DatosUsuarioService,
    DatosFiltradosService,
  ],
  bootstrap: [MiBancoComponent]
})
export class AppModule { }
