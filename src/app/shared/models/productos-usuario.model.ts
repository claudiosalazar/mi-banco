interface Producto {
  id: string;
  productoNombre: string;
  productoNumero: string;
  cupo: string;
}

export interface ProductosUsuario {
  id: string;
  productos: Producto[];
}