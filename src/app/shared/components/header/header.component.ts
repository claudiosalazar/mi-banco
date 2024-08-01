import { Component, OnInit, ElementRef, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BackdropService } from '../../../services/backdrop.service';
import { filter } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';

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

  //datosUsuario: any;
  primer_nombre: any;
  segundo_nombre: any;
  apellido_paterno: any;
  apellido_materno: any;

  currentState = 'initial';
  currentUrl: any;
  public modalConsultaAbierto = false;
  private backdropSubscription: Subscription | undefined;
  mostrarBackdropMenuMobile: boolean = false;
  mostrarBackdropCustomModal = false;
  modales: any[] = [];

  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private renderer: Renderer2,
    private router: Router,
    private backdropService: BackdropService,
  ) { 
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.urlAfterRedirects;
    });
  }

  ngOnInit(): void {
    this.datosUsuarioService.getDatosUsuario().subscribe((datos: DatosUsuario[]) => {
      if (datos.length > 0) {
        const usuario = datos[0];
        // console.log('Datos del usuario:', usuario);
        this.primer_nombre = usuario.primer_nombre;
        this.segundo_nombre = usuario.segundo_nombre;
        this.apellido_paterno = usuario.apellido_paterno;
        this.apellido_materno = usuario.apellido_materno;
      }
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
    if (this.headerElement) {
      const header: HTMLElement = this.headerElement.nativeElement;
      header.style.paddingTop = '16px';
      header.style.paddingBottom = '16px';
      header.style.backgroundColor = 'rgba(116, 45, 72, 1)';
    }
    
    this.modales = Array.from(document.querySelectorAll('.modal')).map(el => {
      const modal = new bootstrap.Modal(el);
      el.addEventListener('show.bs.modal', () => {
        this.backdropService.show();
      });
      el.addEventListener('hide.bs.modal', () => {
        this.backdropService.hide();
      });
      return modal;
    });
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
    var modalConsultas = new bootstrap.Modal(document.getElementById('modalConsultas'), {});
    modalConsultas.show();
    this.backdropService.show();
  }

}