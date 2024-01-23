export interface DatosUsuarioActual {

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

    // Montos de productos
    montosUsuario: {
      ctaCte: {
        ctaCteN: number;
        ctaCteSaldo: number;
        ctaCteTrans: {
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