interface Region {
  id: string;
  value: string;
  label: string;
}

interface RegionComercial {
  id: string;
  value: string;
  label: string;
}

interface Ciudad {
  id: string;
  value: string;
  label: string;
}

interface CiudadComercial {
  id: string;
  value: string;
  label: string;
}

interface Comuna {
  id: string;
  value: string;
  label: string;
}

interface ComunaComercial {
  id: string;
  value: string;
  label: string;
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