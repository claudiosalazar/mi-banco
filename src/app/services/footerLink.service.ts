import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FooterLinkService {
  private titleSource = new BehaviorSubject('Centro de Ayuda');
  currentTitle = this.titleSource.asObservable();

  constructor() { }

  changeTitle(title: string) {
    this.titleSource.next(title);
  }
}