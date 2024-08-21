import { Component, OnInit, ElementRef, ViewChild, HostListener, Renderer2, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BackdropService } from '../../../services/backdrop.service';
import { filter } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { DatosUsuarioService } from '../../../services/datosUsuario.service';
import { DatosUsuario } from '../../../models/datos-usuario.model';

declare var bootstrap: any;

@Component({
  selector: 'mb-header',
  templateUrl: './header.component.html',
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0,
      })),
      state('*', style({
        opacity: 0.6,
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
  @ViewChild('header') headerElement: ElementRef | undefined;

  private backdropSubscription: Subscription | undefined;
  private subscription: Subscription | undefined;
  public modalConsultaAbierto = false;
  public modalEjecutivoAbierto = false;
  public modalTimeOutAbierto = false;

  primer_nombre: any;
  segundo_nombre: any;
  apellido_paterno: any;
  apellido_materno: any;

  currentState = 'initial';
  currentUrl: any;

  mostrarBackdropMenuMobile: boolean = false;
  modales: any[] = [];

  mostrarBackdropCustomModal = false;

  // Definir la variable modalConsultas
  private modalConsultas: any;

  // Variable para almacenar el identificador del temporizador
  private timeoutId: any;

  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private renderer: Renderer2,
    private router: Router,
    private backdropService: BackdropService,
    private authService: AuthService
  ) { 
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.urlAfterRedirects;
    });
  }

  ngOnInit(): void {
    const idUser = localStorage.getItem('id_user') || '';
    if (idUser) {
      const idUserNumber = Number(idUser); // Convertir a número
      this.datosUsuarioService.getDatosUsuario(idUserNumber).subscribe((datos: DatosUsuario[]) => {
        if (datos.length > 0) {
          const usuario = datos[0];
        this.primer_nombre = usuario.primer_nombre;
        this.segundo_nombre = usuario.segundo_nombre;
        this.apellido_paterno = usuario.apellido_paterno;
        this.apellido_materno = usuario.apellido_materno;
        }
      });
    } else {
      console.error('No se encontró id_user en el localStorage');
    }

    this.backdropSubscription = this.backdropService.mostrarBackdropCustomModal$.subscribe(
      mostrar => this.mostrarBackdropCustomModal = mostrar
    );

    // Iniciar el temporizador
    this.resetTimeout();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.backdropSubscription) {
      this.backdropSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(_e: Event): void {
    if (this.headerElement) {
      const header: HTMLElement = this.headerElement.nativeElement;
      header.style.paddingTop = '16px';
      header.style.paddingBottom = '16px';
      header.style.backgroundColor = 'rgba(116, 45, 72, 1)';
    }

    this.modales = Array.from(document.querySelectorAll('.modal')).map(el => {
      const modal = new bootstrap.Modal(el);
      el.addEventListener('show.bs.modal', () => {
        this.backdropService.showModalBackdrop();
      });
      el.addEventListener('hide.bs.modal', () => {
        this.backdropService.hideModalBackdrop();
      });
      return modal;
    });

    // Inicializar el modalConsultas
    const modalElement = document.getElementById('modalConsultas');
    if (modalElement) {
      this.modalConsultas = new bootstrap.Modal(modalElement, {});
    }
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

  abrirMenuMobile(): void {
    this.mostrarBackdropMenuMobile = !this.mostrarBackdropMenuMobile;
  }

  ocultaDropdownMobile() {
    if (this.navbarNavDropdown?.nativeElement.classList.contains('show')) {
      this.navbarNavDropdown.nativeElement.classList.remove('show');
    }
    if (this.navbarToggler && !this.navbarToggler.nativeElement.classList.contains('collapsed')) {
      this.renderer.addClass(this.navbarToggler.nativeElement, 'collapsed');
    }
    this.mostrarBackdropMenuMobile = false;
  }

  abrirModalConsulta(): void {
    this.modalConsultaAbierto = true;
    if (this.modalConsultas) {
      this.modalConsultas.show();
      this.backdropService.showModalBackdrop();
    } else {
      console.error('El modal modalConsultas no está inicializado.');
    }
  }

  abrirModalEjecutivo(): void {
    this.modalEjecutivoAbierto = true;
    var modalEjecutivo = new bootstrap.Modal(document.getElementById('modalEjecutivo'), {});
    modalEjecutivo.show();
    this.backdropService.showModalBackdrop();
  }

  cerrarModalConsulta(): void {
    this.modalConsultaAbierto = false;
    if (this.modalConsultas) {
      this.modalConsultas.hide();
      this.backdropService.hideModalBackdrop();
    } else {
      console.error('El modal modalConsultas no está inicializado.');
    }
  }

  abrirModalTimeOut(): void {
    this.modalTimeOutAbierto = true;
    const modalElement = document.getElementById('modalTimeOut');
    if (modalElement) {
      const modalTimeOut = new bootstrap.Modal(modalElement, {});
      modalTimeOut.show();
      this.backdropService.showModalBackdrop();

      // Inicializar el contador
      let contador = 30;
      const contadorElement = document.getElementById('contador');
      if (contadorElement) {
        contadorElement.textContent = contador.toString();
        const intervalId = setInterval(() => {
          contador--;
          contadorElement.textContent = contador.toString();
          if (contador <= 0) {
            clearInterval(intervalId);
            this.logout(); // Cerrar sesión automáticamente cuando el contador llegue a 0
          }
        }, 1000); // Actualizar cada segundo
      }
    } else {
      console.error('El elemento modalTimeOut no se encontró en el DOM.');
    }
  }

  resetTimeout(): void {
    // Limpiar el temporizador anterior si existe
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Iniciar un nuevo temporizador
    this.timeoutId = setTimeout(() => {
      this.abrirModalTimeOut();
    }, 1800000); // 5000 milisegundos = 5 segundos
  }

  mantenerSesion(): void {
    this.resetTimeout();
  }

  logout() {
    this.authService.logout();
    // Lógica adicional para eliminar el token de sesión
    localStorage.removeItem('token');
    localStorage.removeItem('id_user');
    this.mostrarBackdropCustomModal = false;
  }
}