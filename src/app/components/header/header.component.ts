import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import * as $ from 'jquery'; // Importar la biblioteca jQuery
import { DatosUsuarioService } from 'src/app/services/datos-usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  nombreUserCompleto: string | undefined;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private datosUsuarioService: DatosUsuarioService
  ) { }

  ngOnInit() {
    this.datosUsuarioService.getDatosUsuario().subscribe(datos => {
      this.nombreUserCompleto = datos.nombreUserCompleto;
    });
  }

  showConfirmLogoutModal() {
    // Muestra el modal de confirmación
    ($('#confirmLogoutModal') as any).modal('show'); // Agregar el tipo de dato correcto para el objeto jQuery
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}