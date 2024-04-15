interface Region {
  id: any;
  value: any;
  label: any;
}

interface RegionComercial {
  id: any;
  value: any;
  label: any;
}

interface Ciudad {
  id: any;
  value: any;
  label: any;
}

interface CiudadComercial {
  id: any;
  value: any;
  label: any;
}

interface Comuna {
  id: any;
  value: any;
  label: any;
}

interface ComunaComercial {
  id: any;
  value: any;
  label: any;
}

export interface RegionesCiudadComuna {
  listaRegiones: Region[];
  listaCiudad: Ciudad[];
  listaComuna: Comuna[];
}

export interface RegionesCiudadComunaComercial {
  listaRegionesComercial: RegionComercial[];
  listaCiudadComercial: CiudadComercial[];
  listaComunaComercial: ComunaComercial[];
}