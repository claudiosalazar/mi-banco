import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private requestsCount = 0;
  private loaderSubject = new BehaviorSubject<boolean>(false);
  loaderState = this.loaderSubject.asObservable();

  showLoader() {
    this.requestsCount++;
    this.loaderSubject.next(true);
  }

  hideLoader() {
    if (this.requestsCount > 0) {
      this.requestsCount--;
    }
    if (this.requestsCount === 0) {
      this.loaderSubject.next(false);
    }
  }
}