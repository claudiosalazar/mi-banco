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
import { ProductosComponent } from './views/productos/productos.component';
import { ContactanosComponent } from './views/contactanos/contactanos.component';
import { DatosUsuarioComponent } from './views/datos-usuario/datos-usuario.component';

// Cuenta corriente
import { CuentaCorrienteComponent } from './views/productos/cuenta-corriente/cuenta-corriente.component';
import { TransferenciasComponent } from './views/productos/cuenta-corriente/transferencias/transferencias.component';
import { ComprobanteTransferenciaComponent } from './views/productos/cuenta-corriente/comprobante-transferencia/comprobante-transferencia.component';

// Linea de credito
import { LineaCreditoComponent } from './views/productos/linea-credito/linea-credito.component';
import { LineaCreditoPagoComponent } from './views/productos/linea-credito/linea-credito-pago/linea-credito-pago.component';
import { LineaCreditoComprobanteComponent } from './views/productos/linea-credito/linea-credito-comprobante/linea-credito-comprobante.component';

// Visa
import { VisaComponent } from './views/productos/visa/visa.component';
import { VisaPagoComponent } from './views/productos/visa/visa-pago/visa-pago.component';
import { VisaComprobanteComponent } from './views/productos/visa/visa-comprobante/visa-comprobante.component';

// Otros componentes
import { TransaccionesResumenComponent } from './views/productos/transacciones-resumen/transacciones-resumen.component';
import { SegurosComponent } from './views/productos/seguros/seguros.component';
import { SegurosResumenComponent } from './views/productos/seguros/seguros-resumen/seguros-resumen.component';
import { SegurosContratarComponent } from './views/productos/seguros/seguros-contratar/seguros-contratar.component';
import { AyudaComponent } from './views/ayuda/ayuda.component';
import { SegurosComprobanteComponent } from './views/productos/seguros/seguros-comprobante/seguros-comprobante.component';
import { CustomSelectComponent } from './shared/components/custom-select/custom-select.component';


@NgModule({
  declarations: [
    MiBancoComponent,
    LoginComponent,
    MainComponent,
    HeaderComponent,
    FooterComponent,
    ResumenUsuarioComponent,
    ProductosComponent,
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
    BuscadorTablaComponent,
    TransferenciasComponent,
    ComprobanteTransferenciaComponent,
    SegurosComprobanteComponent,
    CustomSelectComponent
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
    DatosFiltradosService
  ],
  bootstrap: [MiBancoComponent]
})
export class AppModule { }
