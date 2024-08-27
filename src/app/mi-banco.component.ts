import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { LoaderService } from './services/loaderServices.service';

@Component({
  selector: 'app-root',
  templateUrl: './mi-banco.component.html'
})
export class MiBancoComponent implements OnInit, OnDestroy {
  title = 'Mi Banco';

  constructor(
    private router: Router, 
    private loaderService: LoaderService
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
}