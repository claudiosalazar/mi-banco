import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { DatosUsuarioService } from '../../../core/services/datos-usuario.service';
import { filter } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';

declare var bootstrap: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      state('*', style({
        opacity: 0.5
      })),
      transition('void <=> *', animate('0.2s'))
    ])
  ]
})
export class HeaderComponent implements OnInit {

  @ViewChild('navbarNavDropdown') navbarNavDropdown: ElementRef | undefined;
  @ViewChild('modalNuevoDestinatario') modalNuevoDestinatario: ElementRef | undefined;

  primerNombre:any;
  segundoNombre:any;
  apellidoPaterno:any;
  apellidoMaterno:any;
  email:any;
  celular:any;
  telefono:any;
  currentUrl:any;

  mostrarBackdropCustomModal = false;
  modales: any[] = [];
  public modalConsultaAbierto = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private datosUsuarioService: DatosUsuarioService,
  ) { 
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.urlAfterRedirects;
    });
  }

  ngOnInit(): void {
    this.datosUsuarioService.getDatosUsuario().subscribe(datos => {
      this.primerNombre = datos.datosUsuario.primerNombre;
      this.segundoNombre = datos.datosUsuario.segundoNombre;
      this.apellidoPaterno = datos.datosUsuario.apellidoPaterno;
      this.apellidoMaterno = datos.datosUsuario.apellidoMaterno;
      this.email = datos.datosUsuario.email;
      this.celular = datos.datosUsuario.celular;
      this.telefono = datos.datosUsuario.telefono;
    });
  }

  ngAfterViewInit(_e: Event): void {

    // Elmina backdrop de offcanvas y modal
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const backdropModal = document.querySelector('.modal-backdrop.fade.show');
          if (backdropModal && backdropModal.parentNode) {
            backdropModal.parentNode.removeChild(backdropModal);
            // console.log('El backdrop ha sido eliminado');
          }
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });

    this.modales = Array.from(document.querySelectorAll('.modal')).map(el => {
      const modal = new bootstrap.Modal(el);
      el.addEventListener('show.bs.modal', () => {
        this.mostrarBackdropCustomModal = true;
      });
      el.addEventListener('hide.bs.modal', () => {
        this.mostrarBackdropCustomModal = false;
      });
      return modal;
    });
    
  }

  // Reestablece menu en mobile despues de un click
  ocultaDropdownMobile() {
    if (this.navbarNavDropdown?.nativeElement.classList.contains('show')) {
      this.navbarNavDropdown.nativeElement.classList.remove('show');
    }
  }

  // Cierra sesión
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  abrirModalConsulta(): void {
    this.modalConsultaAbierto = true;
    var modalConsultas = new bootstrap.Modal(document.getElementById('modalConsultas'), {});
    modalConsultas.show();
  }

}