import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginComponent } from '../components/login/login.component';
//import { stringify } from 'querystring';
import { environment } from 'src/environments/environment';
import { Profil, User } from '../model/user';
import { TokenStorageService } from './token-storage.service';
//import { env } from 'process';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public loggedIn = new BehaviorSubject<boolean>(true)

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }
  
  constructor(private http: HttpClient, private tokenService: TokenStorageService) {
    if(this.tokenService.getToken() != null) {
      this.loggedIn.next(true)
    } else {
      this.loggedIn.next(false)
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(environment.apiUrl+'/auth/signin', {
      email,
      password
    }, httpOptions)
  }

  register(firstName: string, lastName: string, email: string, msisdn: number, password: string, profil: number): Observable<any> {
    return this.http.post(environment.apiUrl+'/auth/signup', {
      firstName,
      lastName,
      email,
      msisdn,
      password,
      profil,
    }, httpOptions);
  }

  registration(data: User): Observable<any>{
    console.log("user from registration", data)
    return this.http.post<User>(`${environment.apiUrl}/auth/signup`, data, httpOptions);
  } 

  resetPassword(email: any): Observable<any> {
    console.log(email)
    this.tokenService.saveUser(email);
  return this.http.post(`${environment.apiUrl}/auth/resetPassword`, email, {responseType: 'text'});
  }

  changePassword(email: String, password: String): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/changePassword`, {email, password});
  }

}

