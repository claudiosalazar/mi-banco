interface Oferta {
  id: string;
  productoOferta: string;
  montoPreAprobado: string;
}

export interface OfertasProductos {
  find(arg0: (ofertas: any) => boolean): unknown;
  id: string;
  ofertas: Oferta[];
}