import { Component, OnInit, ElementRef, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { DatosUsuarioService } from '../../../core/services/datos-usuario.service';
import { BackdropService } from '../../../core/services/backdrop.service';
import { filter } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';

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
    ]),
    trigger('changeDivSize', [
      state('initial', style({
        height: '90px',
        paddingTop: '16px',
        paddingBottom: '16px'
      })),
      state('final', style({
        height: '60px',
        paddingTop: '12px',
        paddingBottom: '12px'
      })),
      transition('initial=>final', animate('100ms')),
      transition('final=>initial', animate('100ms'))
    ]),
  ]
})
export class HeaderComponent implements OnInit {

  @ViewChild('navbarNavDropdown') navbarNavDropdown: ElementRef | undefined;
  @ViewChild('navbarToggler') navbarToggler: ElementRef | undefined;
  //@ViewChild('modalNuevoDestinatario') modalNuevoDestinatario: ElementRef | undefined;
  @ViewChild('header') headerElement: ElementRef | undefined;
  @ViewChild('modalLogOut') modalLogOut: ElementRef | undefined;
  @ViewChild('modalEjecutivo') modalEjecutivo: ElementRef | undefined;

  public modalConsultaAbierto = false;

  private backdropSubscription: Subscription | undefined;
  
  currentState = 'initial';

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
  
  mostrarBackdropMenuMobile: boolean = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private datosUsuarioService: DatosUsuarioService,
    private renderer: Renderer2,
    private backdropService: BackdropService,
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

    this.backdropSubscription = this.backdropService.mostrarBackdropCustomModal$.subscribe(
      mostrar => this.mostrarBackdropCustomModal = mostrar
    );
    
  }

  ngOnDestroy(): void {
    if (this.backdropSubscription) {
      this.backdropSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(_e: Event): void {
    // Estilos para header
    if (this.headerElement) {
      const header: HTMLElement = this.headerElement.nativeElement;

      //header.style.height = '98px';
      header.style.paddingTop = '16px';
      header.style.paddingBottom = '16px';
      header.style.backgroundColor = 'rgba(116, 45, 72, 1)';
    }
    
    this.modales = Array.from(document.querySelectorAll('.modal')).map(el => {
      const modal = new bootstrap.Modal(el);
      el.addEventListener('show.bs.modal', () => {
        this.backdropService.show();  // Muestra el backdrop
      });
      el.addEventListener('hide.bs.modal', () => {
        this.backdropService.hide();  // Oculta el backdrop
      });
      return modal;
    });

    
  }


  abrirMenuMobile(): void {
    this.mostrarBackdropMenuMobile = !this.mostrarBackdropMenuMobile;
  }


  @HostListener('window:scroll', ['$event'])
  onWindowScroll(_event: any) {
    this.currentState = window.scrollY >= 60 ? 'final' : 'initial';

    if (this.headerElement) {
      const header: HTMLElement = this.headerElement.nativeElement;
      if (window.scrollY >= 60) {
        header.style.backgroundColor = 'rgba(116, 45, 72, .85)';
      } else {
        header.style.backgroundColor = 'rgba(116, 45, 72, 1)';
      }
    }
  }

  // Reestablece menu en mobile despues de un click
  ocultaDropdownMobile() {
    if (this.navbarNavDropdown?.nativeElement.classList.contains('show')) {
      this.navbarNavDropdown.nativeElement.classList.remove('show');
    }
    if (this.navbarToggler && !this.navbarToggler.nativeElement.classList.contains('collapsed')) {
      this.renderer.addClass(this.navbarToggler.nativeElement, 'collapsed');
    }
    this.mostrarBackdropMenuMobile = false;
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
    this.backdropService.show();
  }

  ocultaBackDrop(): void {
    this.backdropService.hide();
  }

}