import { Component, OnInit } from '@angular/core';
import { CuentaCorriente } from '../../../../../../../models/cuenta-corriente.model';
import { TransaccionesService } from '../../../../../../../services/transacciones.service';
import { AgendaService } from '../../../../../../../services/agenda.service';
import { Agenda } from './../../../../../../../models/agenda.model';
import { DatosUsuarioService } from '../../../../../../../services/datosUsuario.service';
import { DatosUsuario } from '../../../../../../../models/datos-usuario.model';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'mb-comprobante-transferencia',
  templateUrl: './comprobante-transferencia.component.html'
})
export class ComprobanteTransferenciaComponent implements OnInit {

  transaccionesCtaCte: CuentaCorriente[] = [];
  agenda: Agenda[] = [];
  cargoUltimaTransaccionCtaCte: number | null = null;
  idDestinatarioUltimaTransaccionCtaCte: any | null = null;
  nombreDestinatarioUltimaTransaccionCtaCte: string | null = null;
  email: any;
  emailDestinatario: any;
  id: number | null = null;

  constructor(
    private transaccionesService: TransaccionesService,
    private agendaService: AgendaService,
    private datosUsuarioService: DatosUsuarioService
  ) { }

  ngOnInit() {
    this.datosUsuarioService.getDatosUsuario().subscribe((datos: DatosUsuario[]) => {
      if (datos.length > 0) {
        const usuario = datos[0];
        this.email = usuario.email;
      }
    });
    
    this.transaccionesService.getTransCuentaCorriente().subscribe((transaccionesCtaCte: CuentaCorriente[]) => {
      if (transaccionesCtaCte) {
        this.transaccionesCtaCte = transaccionesCtaCte;
        this.transaccionesCtaCte.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        this.cargoUltimaTransaccionCtaCte = this.transaccionesCtaCte.length > 0 ? this.transaccionesCtaCte[0].cargo : null;
        this.idDestinatarioUltimaTransaccionCtaCte = this.transaccionesCtaCte.length > 0 ? this.transaccionesCtaCte[0].id_destinatario : null;
        this.nombreDestinatarioUltimaTransaccionCtaCte = this.transaccionesCtaCte.length > 0 ? this.transaccionesCtaCte[0].nombre_destinatario : null;
      }
    });

    this.procesarIdsAgenda();
  }

  loadDataAgenda(): Observable<number[]> {
    return this.agendaService.getAgenda().pipe(
      map((agenda: any[]) => {
        this.agenda = agenda;
        return this.agenda.map(item => item.id);
      })
    );
  }

  procesarIdsAgenda() {
    this.loadDataAgenda().subscribe((ids: number[]) => {
      console.log('IDs de la agenda:', ids);
      const coincidencia = this.agenda.find(item => item.id === this.idDestinatarioUltimaTransaccionCtaCte);
      if (coincidencia !== undefined) {
        this.emailDestinatario = coincidencia.email;
      }
    });
  }

}