import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { DatosUsuarioService } from '../../../core/services/datos-usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  @ViewChild('navbarNavDropdown') navbarNavDropdown: ElementRef | undefined;

  primerNombre: string | undefined;
  segundoNombre: string | undefined;
  apellidoPaterno: string | undefined;
  apellidoMaterno: string | undefined;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private datosUsuarioService: DatosUsuarioService,
    private renderer: Renderer2, // Inyecta Renderer2
    private el: ElementRef // Inyecta ElementRef
  ) { }

  ngOnInit() {
    this.datosUsuarioService.getDatosUsuario().subscribe(datos => {
      this.primerNombre = datos.datosUsuario.primerNombre;
      this.segundoNombre = datos.datosUsuario.segundoNombre;
      this.apellidoPaterno = datos.datosUsuario.apellidoPaterno;
      this.apellidoMaterno = datos.datosUsuario.apellidoMaterno;
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

  ngAfterViewInit() {
    this.navbarNavDropdown?.nativeElement.addEventListener('hidden.bs.dropdown', () => {
      this.navbarNavDropdown?.nativeElement.classList.remove('show');
    });
  }
  
  onLinkClick() {
    if (this.navbarNavDropdown?.nativeElement.classList.contains('show')) {
      this.navbarNavDropdown.nativeElement.classList.remove('show');
    }
  }

}