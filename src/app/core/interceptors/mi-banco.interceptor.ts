import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Aquí puedes manipular la solicitud, por ejemplo, añadir cabeceras
    const modifiedReq = req.clone({
      // ...
    });

    // Luego, pasas la solicitud modificada (o la original) a la siguiente función en la cadena
    return next.handle(modifiedReq);
  }
}