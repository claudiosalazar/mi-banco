import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './mi-banco.component.html'
})
export class MiBancoComponent implements OnInit, OnDestroy {
  title = 'Mi Banco';

  ngOnInit() {
    window.onload = function() {
      window.scrollTo(0, 0);
    };
  }

  ngOnDestroy() {
    window.onload = null;
  }
}