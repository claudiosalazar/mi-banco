import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatosUsuarioService } from '../../../../services/datosUsuario.service';
import { FormatoEmailService } from '../../../../services/formatoEmail.service';
import { LocalidadesService } from '../../../../services/localidades.service';
import { CelularPipe } from '../../../../shared/pipes/celular.pipe';
import { TelefonoFijoPipe } from '../../../../shared/pipes/telefono-fijo.pipe';
import { RutPipe } from '../../../../shared/pipes/rut.pipe';
import { DatosUsuario } from '../../../../models/datos-usuario.model';
import { Localidades } from '../../../../models/localidades.model';

@Component({
  selector: 'mb-datos-usuario',
  templateUrl: './datos-usuario.component.html'
})
export class DatosUsuarioComponent implements OnInit {

  misDatosForm: FormGroup;
  submitted: boolean = false;
  customSelectDisabled: boolean = false;
  listaRegiones: Localidades[] = [];
  listaComunas: Localidades[] = [];
  listaCiudades: Localidades[] = [];
  listaRegionesComerciales: Localidades[] = [];
  listaComunasComerciales: Localidades[] = [];
  listaCiudadesComerciales: Localidades[] = [];

  
  region: any | undefined;
  comuna: any | undefined;
  ciudad: any | undefined;

  regionComercial: any | undefined;
  comunaComercial: any | undefined;
  ciudadComercial: any | undefined;

  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private formatoEmailService: FormatoEmailService,
    private celularPipe: CelularPipe,
    private telefonoFijoPipe: TelefonoFijoPipe,
    private rutPipe: RutPipe,
    private localidadesService: LocalidadesService
  ) { 
    this.misDatosForm = new FormGroup({
      primer_nombre: new FormControl('', [Validators.required]),
      segundo_nombre: new FormControl('', [Validators.required]),
      apellido_paterno: new FormControl('', [Validators.required]),
      apellido_materno: new FormControl('', [Validators.required]),
      rut: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      email_comercial: new FormControl('', [Validators.required]),
      celular: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required]),
      calle: new FormControl('', [Validators.required]),
      numero_calle: new FormControl('', [Validators.required]),
      depto_villa_block: new FormControl('', [Validators.required]),
      ciudad: new FormControl('', [Validators.required]),
      comuna: new FormControl('', [Validators.required]),
      region: new FormControl('', [Validators.required]),
      calle_comercial: new FormControl('', [Validators.required]),
      numero_calle_comercial: new FormControl('', [Validators.required]),
      oficina: new FormControl('', [Validators.required]),
      ciudad_comercial: new FormControl('', [Validators.required]),
      comuna_comercial: new FormControl('', [Validators.required]),
      region_comercial: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {

    this.localidadesService.getRegiones().subscribe((regiones: Localidades[]) => {
      this.listaRegiones = regiones;
      this.listaRegionesComerciales = regiones;
    });
    this.localidadesService.getComunas().subscribe((comunas: Localidades[]) => {
      this.listaComunas = comunas;
      this.listaComunasComerciales = comunas;
    });
    this.localidadesService.getCiudades().subscribe((ciudades: Localidades[]) => {
      this.listaCiudades = ciudades;
      this.listaCiudadesComerciales = ciudades;
    });

    this.datosUsuarioService.getDatosUsuario().subscribe((datos: DatosUsuario[]) => {
      if (datos.length > 0) {
        const usuario = datos[0];
        usuario.rut = this.rutPipe.transform(usuario.rut);
        usuario.celular = this.celularPipe.transform(usuario.celular);
        usuario.telefono = this.telefonoFijoPipe.transform(usuario.telefono);
        this.region = usuario.region;
        this.comuna = usuario.comuna;
        this.ciudad = usuario.ciudad;
        this.regionComercial = usuario.region_comercial;
        this.comunaComercial = usuario.comuna_comercial;
        this.ciudadComercial = usuario.ciudad_comercial;
        this.misDatosForm.patchValue(usuario);
      }
    });

    this.observarCambiosRegion();
    this.observarCambiosComuna();
    this.observarCambiosCiudad();
    this.observarCambiosRegionComercial();
    this.observarCambiosComunaComercial();
    this.observarCambiosCiudadComercial();
  }

  observarCambiosRegion() {
    this.misDatosForm.get('region')?.valueChanges.subscribe(selectedRegionId => {
      const selectedRegion = this.listaRegiones.find(region => region.id === selectedRegionId);
      if (selectedRegion) {
        this.region = selectedRegion.label;
      }
    });
  }

  observarCambiosComuna() {
    this.misDatosForm.get('comuna')?.valueChanges.subscribe(selectedComunaId => {
      const selectedComuna = this.listaComunas.find(comuna => comuna.id === selectedComunaId);
      if (selectedComuna) {
        this.comuna = selectedComuna.label;
      }
    });
  }

  observarCambiosCiudad() {
    this.misDatosForm.get('ciudad')?.valueChanges.subscribe(selectedCiudadId => {
      const selectedCiudad = this.listaCiudades.find(ciudad => ciudad.id === selectedCiudadId);
      if (selectedCiudad) {
        this.ciudad = selectedCiudad.label;
      }
    });
  }

  observarCambiosRegionComercial() {
    this.misDatosForm.get('region_comercial')?.valueChanges.subscribe(selectedRegionComercialId => {
      const selectedRegionComercial = this.listaRegionesComerciales.find(regionComercial => regionComercial.id === selectedRegionComercialId);
      if (selectedRegionComercial) {
        this.regionComercial = selectedRegionComercial.label;
      }
    });
  }

  observarCambiosComunaComercial() {
    this.misDatosForm.get('comuna_comercial')?.valueChanges.subscribe(selectedComunaComercialId => {
      const selectedComunaComercial = this.listaComunasComerciales.find(comunaComercial => comunaComercial.id === selectedComunaComercialId);
      if (selectedComunaComercial) {
        this.comunaComercial = selectedComunaComercial.label;
      }
    });
  }

  observarCambiosCiudadComercial() {
    this.misDatosForm.get('ciudad_comercial')?.valueChanges.subscribe(selectedCiudadComercialId => {
      const selectedCiudadComercial = this.listaCiudadesComerciales.find(ciudadComercial => ciudadComercial.id === selectedCiudadComercialId);
      if (selectedCiudadComercial) {
        this.ciudadComercial = selectedCiudadComercial.label;
      }
    });
  }

}