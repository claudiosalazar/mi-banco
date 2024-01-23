import { DatosUsuarioActual } from './../../assets/models/datos-usuario.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaldosService {
  calcularSaldoCtaCte(datosCtaCte: DatosUsuarioActual): number {
    let saldoInicialCtaCte = datosCtaCte.datosUsuario.montosUsuario.ctaCte.ctaCteSaldo;
    let totalCargosCtaCte = datosCtaCte.datosUsuario.montosUsuario.ctaCte.ctaCteTrans.reduce((total, trans) => total + trans.cargo, 0) as number;
    let totalAbonosCtaCte: number = datosCtaCte.datosUsuario.montosUsuario.ctaCte.ctaCteTrans.reduce((total, trans) => total + trans.abono, 0) as number;
    let saldoFinalCtaCte = saldoInicialCtaCte - totalCargosCtaCte + totalAbonosCtaCte;
    return saldoFinalCtaCte;
  }

  calcularSaldoLineaCre(datosLineaCre: DatosUsuarioActual): number {
    let saldoInicialLineaCre = datosLineaCre.datosUsuario.montosUsuario.lineaCredito.lineaCreSaldo;
    let totalCargosLineaCre = datosLineaCre.datosUsuario.montosUsuario.lineaCredito.lineaCreTrans.reduce((total, trans) => total + trans.cargo, 0) as number;
    let totalAbonosLineaCre: number = datosLineaCre.datosUsuario.montosUsuario.lineaCredito.lineaCreTrans.reduce((total, trans) => total + trans.abono, 0) as number;
    let saldoFinalLineaCre = saldoInicialLineaCre - totalCargosLineaCre + totalAbonosLineaCre;
    return saldoFinalLineaCre;
  }

  calcularSaldoVisa(datosVisa: DatosUsuarioActual): number {
    let saldoInicialVisa = datosVisa.datosUsuario.montosUsuario.visa.visaSaldo;
    let totalCargosVisa = datosVisa.datosUsuario.montosUsuario.visa.visaTrans.reduce((total, trans) => total + trans.cargo, 0) as number;
    let totalAbonosVisa = datosVisa.datosUsuario.montosUsuario.visa.visaTrans.reduce((total, trans) => total + trans.abono, 0) as number;
    let saldoFinalVisa = saldoInicialVisa - totalCargosVisa + totalAbonosVisa;
    return saldoFinalVisa;
  }
}