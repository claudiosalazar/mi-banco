interface Seguro {
  plan: string;
  cuotaMensual: number;
  cuotas: number;
  compania: string;
  nSeguro: number;
  fechaInicio: Date;
  fechaTermino: Date;
  poliza: string;
}

export interface SegurosUsuario {
  seguros: Seguro[];
}

// let segurosUsuario: SegurosUsuario;