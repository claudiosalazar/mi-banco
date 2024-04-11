interface Region {
  id: string;
  value: string;
  label: string;
}

interface Ciudad {
  id: string;
  value: string;
  label: string;
}

interface Comuna {
  id: string;
  value: string;
  label: string;
}

export interface RegionesCiudadComuna {
  listaRegiones: Region[];
  listaCiudad: Ciudad[];
  listaComuna: Comuna[];
}