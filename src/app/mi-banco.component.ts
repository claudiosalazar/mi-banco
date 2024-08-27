import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { LoaderService } from './services/loaderServices.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './mi-banco.component.html'
})
export class MiBancoComponent implements OnInit, OnDestroy {
  title = 'Mi Banco';

  private isReloading = false;

  constructor(
    private router: Router, 
    private loaderService: LoaderService,
    private authService: AuthService
  ) 
  { }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loaderService.showLoader();
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.loaderService.hideLoader();
      }
    });
    window.onload = function() {
      window.scrollTo(0, 0);
    };
  }

  ngOnDestroy() {
    window.onload = null;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: Event) {
    this.isReloading = true;
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(_event: Event) {
    if (!this.isReloading) {
      this.authService.logout();
    }
  }
}