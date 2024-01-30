import { Component } from '@angular/core';
import { FooterLinkService } from '../../../services/footerLink.service';

@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.component.html'
})
export class AyudaComponent {
  title: string | undefined;

  constructor(private footerLinkService: FooterLinkService) { }

  ngOnInit() {
    this.footerLinkService.currentTitle.subscribe(title => this.title = title);
  }
}
