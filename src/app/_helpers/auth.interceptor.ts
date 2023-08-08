import { HTTP_INTERCEPTORS, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { TokenStorageService } from '../service/token-storage.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const TOKEN_HEADER_KEY = 'Authorization'; 
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  token: string | null = null;
  constructor(private tokenService: TokenStorageService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    console.log(req.headers)
    this.token = this.tokenService.getToken();
    console.log(this.token)
    if (this.token) {
      console.log("tttttttttttttttttttttttttttt")
      authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer '+this.token) });
    
      console.log(req)
    }
    return next.handle(authReq);
  }
}
