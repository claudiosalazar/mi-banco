import { Component, Output, EventEmitter } from '@angular/core';
import { FooterLinkService } from '../../../../services/footerLink.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.component.html'
})
export class AyudaComponent {

  @Output() openModalEvent = new EventEmitter<void>();

  titulos: string | undefined;
  

  constructor(
    private route: ActivatedRoute,
    private footerLinkService: FooterLinkService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: { [x: string]: string | undefined; }) => {
      this.titulos = params['id'];
      if (this.titulos !== undefined) {
        this.footerLinkService.changeTitle(this.titulos);
      }
    });
  }

  
  
}