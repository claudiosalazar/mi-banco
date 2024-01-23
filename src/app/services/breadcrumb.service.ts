import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private showBreadcrumb = new BehaviorSubject(true);
  showBreadcrumb$ = this.showBreadcrumb.asObservable();

  

  hide() {
    this.showBreadcrumb.next(false);
  }

  show() {
    this.showBreadcrumb.next(true);
  }
}