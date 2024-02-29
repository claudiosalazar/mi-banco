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
        productoNumero: number;
        cupo: number;
        transacciones: {
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
        productoNumero: number;
        cupo: number;
        transacciones:{
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
        productoNumero: number;
        cupo: number;
        transacciones:{
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
  }
}