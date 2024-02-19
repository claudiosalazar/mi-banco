import { DatosUsuarioActual } from '../../assets/models/datos-usuario.model';
// import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Observable, from, map, of, lastValueFrom } from 'rxjs';
import { Observable, of } from 'rxjs';

/* interface SaldoData {
  saldoFinalVisa: number;
} */

@Injectable({
  providedIn: 'root'
})
export class SaldosService {

  mostrarComprobante: any;
  saldoFinalVisa: any;
  data: number;
  // guardaPagoVisaJson: any;

  constructor() {
    this.data = 0;
  }

  getData(): number {
    return this.data;
  }

  saldoRestanteCtaCte!: number;
  saldoRestanteLineaCre!: number;
  saldoRestanteVisa!: number;

  // private urlData = '../assets/data/datos-usuario.json';

  calcularSaldoCtaCte(datosCtaCte: DatosUsuarioActual): Observable<any> {
    let saldoInicialCtaCte = datosCtaCte.datosUsuario.montosUsuario.ctaCte.ctaCteSaldo;
    let totalCargosCtaCte = datosCtaCte.datosUsuario.montosUsuario.ctaCte.ctaCteTrans.reduce((total, trans) => total + trans.cargo, 0) as number;
    let totalAbonosCtaCte: number = datosCtaCte.datosUsuario.montosUsuario.ctaCte.ctaCteTrans.reduce((total, trans) => total + trans.abono, 0) as number;
    let saldoFinalCtaCte = saldoInicialCtaCte - totalCargosCtaCte + totalAbonosCtaCte;
    return of (saldoFinalCtaCte);
  }

  calcularSaldoLineaCre(datosLineaCre: DatosUsuarioActual): Observable<number> {
    let saldoInicialLineaCre = datosLineaCre.datosUsuario.montosUsuario.lineaCredito.lineaCreCupo;
    let totalCargosLineaCre = datosLineaCre.datosUsuario.montosUsuario.lineaCredito.lineaCreTrans.reduce((total, trans) => total + trans.cargo, 0) as number;
    let totalAbonosLineaCre: number = datosLineaCre.datosUsuario.montosUsuario.lineaCredito.lineaCreTrans.reduce((total, trans) => total + trans.abono, 0) as number;
    let saldoFinalLineaCre = saldoInicialLineaCre - totalCargosLineaCre + totalAbonosLineaCre;
    return of (saldoFinalLineaCre);
  }

  calcularSaldoVisa(datosVisa: DatosUsuarioActual): Observable<number> {
    let saldoInicialVisa = datosVisa.datosUsuario.montosUsuario.visa.visaCupo;
    let totalCargosVisa = datosVisa.datosUsuario.montosUsuario.visa.visaTrans.reduce((total, trans) => total + trans.cargo, 0) as number;
    let totalAbonosVisa = datosVisa.datosUsuario.montosUsuario.visa.visaTrans.reduce((total, trans) => total + trans.abono, 0) as number;
    let saldoFinalVisa = saldoInicialVisa - totalCargosVisa + totalAbonosVisa;
    return of (saldoFinalVisa);
  }

  // Saldo disponible para cuenta corriente
  calculaSaldoRestanteCtaCte(datosCtaCte: DatosUsuarioActual): Observable<number> {
    let saldoInicialCtaCte = datosCtaCte.datosUsuario.montosUsuario.ctaCte.ctaCteSaldo;
    let totalCargosCtaCte = datosCtaCte.datosUsuario.montosUsuario.ctaCte.ctaCteTrans.reduce((total, trans) => total + trans.cargo, 0) as number;
    let saldoRestanteCtaCte = saldoInicialCtaCte - totalCargosCtaCte;
    return of (saldoRestanteCtaCte);
  }
  
  // Saldo disponible para linea de credito
  calculaSaldoRestanteLineaCre(datosVisa: DatosUsuarioActual): Observable<number> {
    let saldoInicialLineaCre = datosVisa.datosUsuario.montosUsuario.lineaCredito.lineaCreCupo;
    let totalCargosLineaCre = datosVisa.datosUsuario.montosUsuario.lineaCredito.lineaCreTrans.reduce((total, trans) => total + trans.cargo, 0) as number;
    let saldoRestanteLineaCre = saldoInicialLineaCre - totalCargosLineaCre;
    return of (saldoRestanteLineaCre);
  }

  // Saldo disponible para visa
  calculaSaldoRestanteVisa(datosVisa: DatosUsuarioActual): Observable<number> {
    let saldoInicialVisa = datosVisa.datosUsuario.montosUsuario.visa.visaCupo;
    let totalCargosVisa = datosVisa.datosUsuario.montosUsuario.visa.visaTrans.reduce((total, trans) => total + trans.cargo, 0) as number;
    let saldoRestanteVisa = saldoInicialVisa - totalCargosVisa;
    return of (saldoRestanteVisa);
  }

  // Guardar datos en archivo JSON


  /* guardarPagoVisaJson(saldoFinalVisa: number): Observable<number> {
    const params = new HttpParams().set('saldoFinalVisa', saldoFinalVisa.toString());
    const request$ = this.http.get<{ saldo: number }>('../../assets/data/datos-usuario.json', { params });
    return from(lastValueFrom(request$)).pipe(
      map(response => {
        if (response && typeof response.saldo === 'number') {
          return response.saldo;
        } else {
          throw new Error('La respuesta de la API no es un número');
        }
      })
    );
  } */

}