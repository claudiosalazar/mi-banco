import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import * as $ from 'jquery'; // Importar la biblioteca jQuery
import { DatosUsuarioService } from 'src/app/services/datos-usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  nombreUserCompleto: string | undefined;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private datosUsuarioService: DatosUsuarioService,
    private renderer: Renderer2, // Inyecta Renderer2
    private el: ElementRef // Inyecta ElementRef
  ) { }

  ngOnInit() {
    this.datosUsuarioService.getDatosUsuario().subscribe(datos => {
      this.nombreUserCompleto = datos.datosUsuario.nombreUserCompleto;
    });
  }

  showConfirmLogoutModal() {
    // Muestra el modal de confirmación
    const modal = this.el.nativeElement.querySelector('#confirmLogoutModal');
    this.renderer.addClass(modal, 'show');
    this.renderer.setStyle(modal, 'display', 'block');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}