import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { LoaderService } from 'src/app/services/loaderServices.service'; 

@Component({
  selector: 'mb-loader',
  templateUrl: './loader.component.html',
  animations: [
    trigger('fade', [
      state('void', style({
        opacity: 0,
      })),
      state('*', style({
        opacity: 1,
      })),
      transition('void <=> *', animate('0.5s ease-in-out'))
    ]),
  ]
})
export class LoaderComponent implements OnInit {
  showLoader = true;

  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    this.loaderService.loaderState.subscribe((state: boolean) => {
      this.showLoader = state;
    });
  }
}