export interface DatosUsuarioActual {
  saldoFinalCtaCte: any;
  saldoFinalLineaCre: any;
  saldoFinalVisa: any;
  montosUsuario: any;
  // Datos de usuario
  datosUsuario: {
    nombreUserCompleto: string;
    nombreUser: string;
    rut: string;
    email: string;
    fonoCelular: string;
    fonoParticular: string;
    direccion: string;
   

    // Ofertas de productos
    ofertasProductos: {
      creditoPre: number,
      seguroOferta: number,
      ofertaVisa: number
    },

    // Seguros
    seguros: {
      seguroHogar: {
        plan: string;
        cuotaMensual: number;
        cuotas: number;
        compania: string;
        nSeguro: number;
        fechaInicio: number;
        fechaTermino: number;
        poliza: number;
        formaPago: string;
      };
      seguroVida: {
        plan: string;
        cuotaMensual: number;
        cuotas: number;
        compania: string;
        nSeguro: number;
        fechaInicio: number;
        fechaTermino: number;
        poliza: number;
        formaPago: string;
      }
    }

    // Montos de productos
    montosUsuario: {
      ctaCte: {
        ctaCteN: number;
        ctaCteSaldo: number;
        ctaCteTrans: {
          saldoFinal: any;
          reduce(arg0: (total: any, trans: any) => any, arg1: number): unknown;
          map(arg0: (trans: any) => any): number[];
          slice(): unknown;
          fecha: number;
          detalle: string;
          cargo: number;
          abono: number;
          saldo: number;
        }
      };
      lineaCredito: {
        lineaCreN: number;
        lineaCreSaldo: number;
        lineaCreTrans:{
          saldoFinal: any;
          reduce(arg0: (total: any, trans: any) => any, arg1: number): unknown;
          map(arg0: (trans: any) => any): number[];
          slice(): unknown;
          fecha: number;
          detalle: string;
          cargo: number;
          abono: number;
          saldo: number;
        }
      };
      visa: {
        visaN: number;
        visaSaldo: number;
        visaTrans:{
          saldoFinal: any;
          reduce(arg0: (total: any, trans: any) => any, arg1: number): unknown;
          map(arg0: (trans: any) => any): number[];
          slice(): unknown;
          fecha: number;
          detalle: string;
          cargo: number;
          abono: number;
          saldo: number;
        }
      }
    }
  }
}