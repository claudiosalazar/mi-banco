import { Component, OnInit } from '@angular/core';
import { SegurosUsuarioService } from '../../../core/services/seguros-usuario.service';
import { OfertasProductosService } from '../../../core/services/ofertas-productos.service';
@Component({
  selector: 'app-seguros',
  templateUrl: './seguros.component.html'
})
export class SegurosComponent implements OnInit {

  seguros: any;
  productoOferta: string | undefined;
  montoPreAprobado: number | undefined;
  ofertasProductos: { ofertas: any[] } = { ofertas: [''] };
  montoPreAprobadoCreditoConsumo: any;

  constructor(
    private segurosUsuarioService: SegurosUsuarioService,
    private ofertasProductosService: OfertasProductosService
  ) { }

  ngOnInit(): void {
    this.segurosUsuarioService.getSegurosUsuario().subscribe(data => {
      console.log('Datos seguros:', data);
      this.seguros = data;
    });
    
    this.getOfertasProductos('');
  }

  getOfertasProductos(id: string): void {
    this.ofertasProductosService.getOfertasProductos(id).subscribe(data => {
      this.ofertasProductos = data.ofertas ? { ofertas: data.ofertas } : { ofertas: [] };
      this.montoPreAprobadoCreditoConsumo = this.ofertasProductos.ofertas[0].montoPreAprobado;
    });
  }
}