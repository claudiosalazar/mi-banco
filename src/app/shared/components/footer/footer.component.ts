import { Component } from '@angular/core';
import { FooterLinkService } from '../../../core/services/footerLink.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  constructor(
    private router: Router, 
    private footerLinkService: FooterLinkService
  ) { }

  onLinkClick(title: string) {
    this.footerLinkService.changeTitle(title);
    this.router.navigate(['/mibanco/ayuda', title]);
    window.scrollTo(0, 0);
  }
}
