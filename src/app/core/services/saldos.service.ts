
import { DatosUsuarioActual } from '../../shared/models/datos-usuario.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
// import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SaldosService {

  private urlData = './assets/data/datos-usuario.json';
  data: number;
  
  saldoctaCte!: number;
  disponibleCtaCte!: number;

  saldoLineaCre!: number;
  disponibleLineaCre!: number;

  saldoVisa!: number;
  disponibleVisa!: number;

  constructor(
    private http: HttpClient
  ) {
    this.data = 0;
  }

  getData(): number {
    return this.data;
  }

  /* saldoActualVisa(): Observable<number> {
    return this.http.get<number>(this.urlData);
  } */

  // Calculos para montos Cuenta Corriente
  /*calcularSaldoCtaCte(datosCtaCte: DatosUsuarioActual): Observable<any> {
    let saldoInicial = datosCtaCte.datosUsuario.montosUsuario.ctaCte.cupo;
    let cargo = datosCtaCte.datosUsuario.montosUsuario.ctaCte.transacciones.reduce((total, trans) => total + trans.cargo, 0) as number;
    let abono: number = datosCtaCte.datosUsuario.montosUsuario.ctaCte.transacciones.reduce((total, trans) => total + trans.abono, 0) as number;
    let saldoCtaCte = saldoInicial - cargo + abono;
    return of (saldoCtaCte);
  }

  calcularDisponibleCtaCte(datosCtaCte: DatosUsuarioActual): Observable<number> {
    let cupo = datosCtaCte.datosUsuario.montosUsuario.ctaCte.cupo;
    return new Observable<number>(observer => {
        this.calcularSaldoCtaCte(datosCtaCte).subscribe(saldoCtaCte => {
            let disponibleCtaCte = cupo - saldoCtaCte;
            observer.next(disponibleCtaCte);
            observer.complete();
        });
    });
  }

  // Calculos para montos Linea de Credito
  calcularSaldoLineaCre(datosLineaCre: DatosUsuarioActual): Observable<number> {
    let saldoInicial = datosLineaCre.datosUsuario.montosUsuario.lineaCredito.cupo;
    let cargo = datosLineaCre.datosUsuario.montosUsuario.lineaCredito.transacciones.reduce((total, trans) => total + trans.cargo, 0) as number;
    let abono: number = datosLineaCre.datosUsuario.montosUsuario.lineaCredito.transacciones.reduce((total, trans) => total + trans.abono, 0) as number;
    let saldoLineaCredito = saldoInicial - cargo + abono;
    return of (saldoLineaCredito);
  }

  calcularDisponibleLineaCre(datosLineaCre: DatosUsuarioActual): Observable<number> {
    let cupo = datosLineaCre.datosUsuario.montosUsuario.lineaCredito.cupo;
    return new Observable<number>(observer => {
        this.calcularSaldoLineaCre(datosLineaCre).subscribe(saldoLineaCredito => {
            let disponibleLineaCre = cupo - saldoLineaCredito;
            observer.next(disponibleLineaCre);
            observer.complete();
        });
    });
  }

  // Calculos para montos Visa
  calcularSaldoVisa(datosVisa: DatosUsuarioActual): Observable<number> {
    let saldoInicial = datosVisa.datosUsuario.montosUsuario.visa.cupo;
    let cargo = datosVisa.datosUsuario.montosUsuario.visa.transacciones.reduce((total, trans) => total + trans.cargo, 0) as number;
    let abono = datosVisa.datosUsuario.montosUsuario.visa.transacciones.reduce((total, trans) => total + trans.abono, 0) as number;
    let saldoVisa = saldoInicial - cargo + abono;
    return of (saldoVisa);
  }

  calcularDisponibleVisa(datosVisa: DatosUsuarioActual): Observable<number> {
    let cupo = datosVisa.datosUsuario.montosUsuario.visa.cupo;
    return new Observable<number>(observer => {
        this.calcularSaldoVisa(datosVisa).subscribe(saldoVisa => {
            let disponibleVisa = cupo - saldoVisa;
            observer.next(disponibleVisa);
            observer.complete();
        });
    });
  }*/

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