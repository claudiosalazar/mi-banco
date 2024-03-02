interface Producto {
  id: any;
  productoNombre: string;
  productoNumero: string;
  cupo: string;
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
  id: string;
  productos: Producto[];
}