import { DatosUsuarioActual } from './../../assets/models/datos-usuario.model';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaldosService {

  calcularSaldoCtaCte(datosCtaCte: DatosUsuarioActual): Observable<any> {
    let saldoInicialCtaCte = datosCtaCte.datosUsuario.montosUsuario.ctaCte.ctaCteSaldo;
    let totalCargosCtaCte = datosCtaCte.datosUsuario.montosUsuario.ctaCte.ctaCteTrans.reduce((total, trans) => total + trans.cargo, 0) as number;
    let totalAbonosCtaCte: number = datosCtaCte.datosUsuario.montosUsuario.ctaCte.ctaCteTrans.reduce((total, trans) => total + trans.abono, 0) as number;
    let saldoFinalCtaCte = saldoInicialCtaCte - totalCargosCtaCte + totalAbonosCtaCte;
    return of (saldoFinalCtaCte);
  }

  calcularSaldoLineaCre(datosLineaCre: DatosUsuarioActual): Observable<number> {
    let saldoInicialLineaCre = datosLineaCre.datosUsuario.montosUsuario.lineaCredito.lineaCreSaldo;
    let totalCargosLineaCre = datosLineaCre.datosUsuario.montosUsuario.lineaCredito.lineaCreTrans.reduce((total, trans) => total + trans.cargo, 0) as number;
    let totalAbonosLineaCre: number = datosLineaCre.datosUsuario.montosUsuario.lineaCredito.lineaCreTrans.reduce((total, trans) => total + trans.abono, 0) as number;
    let saldoFinalLineaCre = saldoInicialLineaCre - totalCargosLineaCre + totalAbonosLineaCre;
    return of (saldoFinalLineaCre);
  }

  calcularSaldoVisa(datosVisa: DatosUsuarioActual): Observable<number> {
    let saldoInicialVisa = datosVisa.datosUsuario.montosUsuario.visa.visaSaldo;
    let totalCargosVisa = datosVisa.datosUsuario.montosUsuario.visa.visaTrans.reduce((total, trans) => total + trans.cargo, 0) as number;
    let totalAbonosVisa = datosVisa.datosUsuario.montosUsuario.visa.visaTrans.reduce((total, trans) => total + trans.abono, 0) as number;
    let saldoFinalVisa = saldoInicialVisa - totalCargosVisa + totalAbonosVisa;
    return of (saldoFinalVisa);
  }

  /* 
  calcularDiferenciaCtaCte(datosCtaCte: DatosUsuarioActual): number {
    let saldoInicialCtaCte = datosCtaCte.datosUsuario.montosUsuario.ctaCte.ctaCteSaldo;
    let saldoFinalCtaCte = this.calcularDiferenciaCtaCte(datosCtaCte);
    let cupoUtilizadoCtaCte = saldoInicialCtaCte - saldoFinalCtaCte;
    return cupoUtilizadoCtaCte;
  }
  
  calcularDiferenciaLineaCre(datosLineaCre: DatosUsuarioActual): number {
    let saldoInicialLineaCre = datosLineaCre.datosUsuario.montosUsuario.lineaCredito.lineaCreSaldo;
    let saldoFinalLineaCre = this.calcularSaldoLineaCre(datosLineaCre);
    let cupoUtilizadoLineaCre = saldoInicialLineaCre - saldoFinalLineaCre;
    return cupoUtilizadoLineaCre;
  }

  calcularDiferenciaVisa(datosVisa: DatosUsuarioActual): number {
    let saldoInicialVisa = datosVisa.datosUsuario.montosUsuario.visa.visaSaldo;
    let saldoFinalVisa = this.calcularSaldoVisa(datosVisa);
    let cupoUtilizadoVisa = saldoInicialVisa - saldoFinalVisa;
    return cupoUtilizadoVisa;
  } */
}