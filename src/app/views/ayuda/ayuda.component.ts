import { Component } from '@angular/core';
import { FooterLinkService } from '../../core/services/footerLink.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.component.html'
})
export class AyudaComponent {
  title: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private footerLinkService: FooterLinkService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: { [x: string]: string | undefined; }) => {
      this.title = params['id'];
      if (this.title !== undefined) {
        this.footerLinkService.changeTitle(this.title);
      }
    });
  }
}
