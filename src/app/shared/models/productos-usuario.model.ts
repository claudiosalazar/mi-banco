interface Transaccion {
  id: any;
  fecha: string;
  detalle: string;
  cargo: string;
  abono: string;
  saldo: string;
}


interface Producto {
  id: any;
  productoNombre: string;
  productoNumero: string;
  cupo: string;
  cupoDisponible: string;
  transacciones: Transaccion[];
}

export interface ProductosUsuario {
  find(arg0: (producto: any) => boolean): unknown;
  id: any;
  productos: Producto[];
  transacciones: Transaccion[];
}