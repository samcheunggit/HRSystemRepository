import { AuthenticationService } from './authentication.service';
import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor,
         HttpRequest,
         HttpHandler, 
         HttpEvent, 
         HttpErrorResponse,
         HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private authenticationService: AuthenticationService;

  constructor(private inj: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = {'Content-Type': 'application/json'};

    this.authenticationService = this.inj.get(AuthenticationService);

    const customRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authenticationService.getToken()}`
      }
    });

    return next.handle(customRequest)
      .do((ev: HttpEvent<any>) => {
        if (ev instanceof HttpResponse) {
          console.log('processing response', ev);
        }
      })
      .catch(response => {
        if (response instanceof HttpErrorResponse) {
          console.log('Processing http error', response);
        }

        return Observable.throw(response);
      });

  }
}