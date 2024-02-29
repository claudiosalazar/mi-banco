interface Oferta {
  id: string;
  productoOferta: string;
  montoPreAprobado: string;
}

export interface OfertasProductos {
  id: string;
  ofertas: Oferta[];
}