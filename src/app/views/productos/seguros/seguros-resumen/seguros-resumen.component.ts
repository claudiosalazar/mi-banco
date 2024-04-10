import { Component, OnInit } from '@angular/core';
import { SegurosUsuarioService } from '../../../../core/services/seguros-usuario.service';
import { OfertasProductosService } from '../../../../core/services/ofertas-productos.service';

@Component({
  selector: 'app-seguros-resumen',
  templateUrl: './seguros-resumen.component.html'
})
export class SegurosResumenComponent implements OnInit {

  seguros: any;
  productoOferta: string | undefined;
  montoPreAprobado: number | undefined;
  ofertasProductos: { ofertas: any[] } = { ofertas: [''] };

  constructor(
    private segurosUsuarioService: SegurosUsuarioService,
    private ofertasProductosService: OfertasProductosService
  ) { }

  ngOnInit(): void {
    this.segurosUsuarioService.getSegurosUsuario().subscribe(data => {
      console.log('Datos seguros:', data);
      this.seguros = data;
    });
    
    this.getOfertaParaBanner('');
  }

  getOfertaParaBanner(id: string): void {
    this.ofertasProductosService.getOfertasProductos(id).subscribe(data => {
      this.ofertasProductos = data.ofertas ? { ofertas: data.ofertas } : { ofertas: [] };
      this.productoOferta = this.ofertasProductos.ofertas[3].productoOferta;
      this.montoPreAprobado = this.ofertasProductos.ofertas[3].montoPreAprobado;
    });
  }
}