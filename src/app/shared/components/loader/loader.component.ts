import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/services/loaderServices.service'; 

@Component({
  selector: 'mb-loader',
  templateUrl: './loader.component.html'
})

export class LoaderComponent implements OnInit {
  showLoader = false;

  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    this.loaderService.loaderState.subscribe((state: boolean) => {
      this.showLoader = state;
    });
  }
}