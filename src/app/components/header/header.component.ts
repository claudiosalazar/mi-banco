import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import * as $ from 'jquery'; // Importar la biblioteca jQuery

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  constructor(private authService: AuthService, private router: Router) { }

  showConfirmLogoutModal() {
    // Muestra el modal de confirmación
    ($('#confirmLogoutModal') as any).modal('show'); // Agregar el tipo de dato correcto para el objeto jQuery
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}