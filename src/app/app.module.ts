import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Login
import { LoginComponent } from './auth/components/login/login.component';

// Pipe
import { DatePipe } from '@angular/common';
import { PesosPipe } from './shared/pipes/pesos.pipe';
import { RutPipe } from './shared/pipes/rut.pipe';
import { CelularPipe } from './shared/pipes/celular.pipe';
import { TelefonoFijoPipe } from './shared/pipes/telefono-fijo.pipe';
import { NumeroTarjetaPipe } from './shared/pipes/numero-tarjeta.pipe';

// Services
import { DatosUsuarioService, ListaGeograficaService, ListaGeograficaComercialService } from './core/services/datos-usuario.service';
import { DatosFiltradosService } from './core/services/productos-usuario.service';
import { CartolasHistoricasService } from './core/services/cartolas-historicas.service';

// Componentes compartidos
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { TablesProductosComponent } from './shared/components/tables/movimientos-productos/table-productos.component';
import { BuscadorTablaComponent } from './shared/components/tables/buscador-tabla/buscador-tabla.component';

// Componentes
import { MiBancoComponent } from './mi-banco.component';
import { MainComponent } from './shared/components/main/main.component';
import { ResumenUsuarioComponent } from './views/resumen-usuario/resumen-usuario.component';
import { ProductosComponent } from './views/productos/productos.component';
import { DatosUsuarioComponent } from './views/datos-usuario/datos-usuario.component';

// Cuenta corriente
import { CuentaCorrienteComponent } from './views/productos/cuenta-corriente/cuenta-corriente.component';
import { MovimientosComponent } from './views/productos/cuenta-corriente/movimientos/movimientos.component';
import { TransferenciasComponent } from './views/productos/cuenta-corriente/transferencias/transferencias.component';
import { ComprobanteTransferenciaComponent } from './views/productos/cuenta-corriente/transferencias/comprobante-transferencia/comprobante-transferencia.component';
import { CartolaHistoricaComponent } from './views/productos/cuenta-corriente/cartola-historica/cartola-historica.component';
import { AgendaDestinatariosComponent } from './views/productos/cuenta-corriente/transferencias/agenda-destinatarios/agenda-destinatarios.component';
import { AgregarDestinatarioComponent } from './views/productos/cuenta-corriente/transferencias/agregar-destinatario/agregar-destinatario.component';
import { EditarDestinatarioComponent } from './views/productos/cuenta-corriente/transferencias/editar-destinatario/editar-destinatario.component';
import { UltimasTransferenciasComponent } from './views/productos/cuenta-corriente/transferencias/ultimas-transferencias/ultimas-transferencias.component';

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
import { AyudaComponent } from './views/ayuda/ayuda.component';
import { CustomSelectComponent } from './shared/components/custom-select/custom-select.component';
import { CustomSelectReactivoComponent } from './shared/components/custom-select-reactivo/custom-select-reactivo.component';
import { TransferenciaATercerosComponent } from './views/productos/cuenta-corriente/transferencias/transferencia-a-terceros/transferencia-a-terceros.component';
import { PaginadorComponent } from './shared/components/tables/paginador/paginador.component';
import { ModaConsultasComponent } from './shared/components/header/moda-consultas/moda-consultas.component';
import { CarouselComponent } from './views/resumen-usuario/carousel/carousel.component';
import { BreadcrumbComponent } from './shared/components/breadcrumb/breadcrumb.component';
import { AlertasComponent } from './shared/components/alertas/alertas.component';





@NgModule({
  declarations: [
    MiBancoComponent,
    LoginComponent,
    MainComponent,
    HeaderComponent,
    FooterComponent,
    ResumenUsuarioComponent,
    ProductosComponent,
    PesosPipe,
    RutPipe,
    CelularPipe,
    TelefonoFijoPipe,
    NumeroTarjetaPipe,
    DatosUsuarioComponent,
    CuentaCorrienteComponent,
    LineaCreditoComponent,
    VisaComponent,
    TransaccionesResumenComponent,
    SegurosComponent,
    AyudaComponent,
    LineaCreditoPagoComponent,
    LineaCreditoComprobanteComponent,
    VisaPagoComponent,
    VisaComprobanteComponent,
    TablesProductosComponent,
    BuscadorTablaComponent,
    TransferenciasComponent,
    ComprobanteTransferenciaComponent,
    CustomSelectComponent,
    PaginadorComponent,
    CartolaHistoricaComponent,
    MovimientosComponent,
    AgendaDestinatariosComponent,
    AgregarDestinatarioComponent,
    EditarDestinatarioComponent,
    UltimasTransferenciasComponent,
    TransferenciaATercerosComponent,
    CustomSelectReactivoComponent,
    ModaConsultasComponent,
    CarouselComponent,
    BreadcrumbComponent,
    AlertasComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  providers: [
    DatosUsuarioService,
    DatosFiltradosService,
    CartolasHistoricasService,
    PesosPipe,
    RutPipe,
    CelularPipe,
    TelefonoFijoPipe,
    DatePipe,
    ListaGeograficaService,
    ListaGeograficaComercialService,
  ],
  bootstrap: [MiBancoComponent]
})
export class AppModule { }
