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
import { MovimientosComponent } from './components/private/views/productos/cuenta-corriente/movimientos/movimientos.component';
import { AgregarDestinatarioComponent } from './components/private/views/productos/cuenta-corriente/transferencias/agregar-destinatario/agregar-destinatario.component';
import { ComprobanteTransferenciaComponent } from './components/private/views/productos/cuenta-corriente/transferencias/comprobante-transferencia/comprobante-transferencia.component';
import { EditarDestinatarioComponent } from './components/private/views/productos/cuenta-corriente/transferencias/editar-destinatario/editar-destinatario.component';
import { TransferenciaATercerosComponent } from './components/private/views/productos/cuenta-corriente/transferencias/transferencia-a-terceros/transferencia-a-terceros.component';
import { UltimasTransferenciasComponent } from './components/private/views/productos/cuenta-corriente/transferencias/ultimas-transferencias/ultimas-transferencias.component';
import { LineaCreditoComponent } from './components/private/views/productos/linea-credito/linea-credito.component';
import { LineaCreditoComprobanteComponent } from './components/private/views/productos/linea-credito/linea-credito-comprobante/linea-credito-comprobante.component';
import { LineaCreditoPagoComponent } from './components/private/views/productos/linea-credito/linea-credito-pago/linea-credito-pago.component';
import { SegurosComponent } from './components/private/views/productos/seguros/seguros.component';
import { TransaccionesResumenComponent } from './components/private/views/productos/transacciones-resumen/transacciones-resumen.component';
import { VisaComponent } from './components/private/views/productos/visa/visa.component';
import { VisaComprobanteComponent } from './components/private/views/productos/visa/visa-comprobante/visa-comprobante.component';
import { VisaPagoComponent } from './components/private/views/productos/visa/visa-pago/visa-pago.component';
import { AyudaComponent } from './components/private/views/ayuda/ayuda.component';
import { DatosUsuarioComponent } from './components/private/views/datos-usuario/datos-usuario.component';
import { AgendaDestinatariosComponent } from './components/private/views/productos/cuenta-corriente/transferencias/agenda-destinatarios/agenda-destinatarios.component';
import { TransferenciasComponent } from './components/private/views/productos/cuenta-corriente/transferencias/transferencias.component';
import { CartolaHistoricaComponent } from './components/private/views/productos/cuenta-corriente/cartola-historica/cartola-historica.component';
import { CuentaCorrienteComponent } from './components/private/views/productos/cuenta-corriente/cuenta-corriente.component';
import { ProductosComponent } from './components/private/views/productos/productos.component';




@NgModule({
  declarations: [
    MiBancoComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    PrivateComponent,
    HomeComponent,
    ProductosComponent,
    CuentaCorrienteComponent,
    CartolaHistoricaComponent,
    MovimientosComponent,
    TransferenciasComponent,
    AgendaDestinatariosComponent,
    AgregarDestinatarioComponent,
    ComprobanteTransferenciaComponent,
    EditarDestinatarioComponent,
    TransferenciaATercerosComponent,
    UltimasTransferenciasComponent,
    LineaCreditoComponent,
    LineaCreditoComprobanteComponent,
    LineaCreditoPagoComponent,
    SegurosComponent,
    TransaccionesResumenComponent,
    VisaComponent,
    VisaComprobanteComponent,
    VisaPagoComponent,
    AyudaComponent,
    DatosUsuarioComponent,
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
