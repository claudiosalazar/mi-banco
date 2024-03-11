interface Producto {
  id: any;
  productoNombre: string;
  productoNumero: string;
  cupo: string;
  cupoDisponible: string;
  transacciones: [
    {
      fecha: string;
      detalle: string;
      cargo: string;
      abono: string;
      saldo: string;
    }
  
  ];
}

export interface ProductosUsuario {
  find(arg0: (producto: any) => boolean): unknown;
  id: any;
  productos: Producto[];
}