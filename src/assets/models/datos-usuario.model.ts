export interface DatosUsuarioActual {
  ctaCteMonto(ctaCteMonto: any): number | undefined;
  datosUsuario: {
    nombreUserCompleto: string;
    nombreUser: string;
    rut: string;
    email: string;
    fonoCelular: string;
    fonoParticular: string;
    direccion: string;
    ctaCteN: string;
    lineaCreN: string;
    tarjetaVisaN: string;
  }
  montosUsuario: {
    ctaCteMonto: number;
    lineaCreMonto: number;
    tarjetaVisaMonto: number;
    creditoPre: number;
    seguro: number;
    oferta: number;
  },
  transacciones: {
    slice(): unknown;
    col1: number;
    col2: number;
    col3: number;
    col4: number;
    col5: number;
  }
}