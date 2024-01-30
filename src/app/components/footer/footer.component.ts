import { Component } from '@angular/core';
import { FooterLinkService } from '../../services/footerLink.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  constructor(private footerLinkService: FooterLinkService) { }

  onLinkClick(title: string) {
    this.footerLinkService.changeTitle(title);
  }
}
