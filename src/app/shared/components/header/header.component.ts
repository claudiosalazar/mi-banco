import { Component, OnInit, ElementRef, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BackdropService } from '../../../services/backdrop.service';
import { filter } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';

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

  public modalConsultaAbierto = false;
  private backdropSubscription: Subscription | undefined;
  mostrarBackdropMenuMobile: boolean = false;
  mostrarBackdropCustomModal = false;
  modales: any[] = [];

  constructor(
    private renderer: Renderer2,
    private backdropService: BackdropService,
  ) { 
    
  }

  ngOnInit(): void {
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