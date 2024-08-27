import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private requestsCount = 0;
  private loaderSubject = new BehaviorSubject<boolean>(false);
  loaderState = this.loaderSubject.asObservable();
  private loaderTimeout: any;

  showLoader() {
    this.requestsCount++;
    if (this.requestsCount === 1) {
      this.loaderTimeout = setTimeout(() => {
        this.loaderSubject.next(true);
      }, 500);
    }
  }

  hideLoader() {
    if (this.requestsCount > 0) {
      this.requestsCount--;
    }
    if (this.requestsCount === 0) {
      clearTimeout(this.loaderTimeout);
      this.loaderSubject.next(false);
    }
  }
}