import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, ObservedValueOf } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Profil, User } from '../model/user';

 

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(environment.apiUrl+'/user/');
  }

  getUserById(id: any): Observable<any> {
    return this.http.get<any>(environment.apiUrl+'/user/'+id);

  }

  getUserByEmail(email: string): Observable<any> {
    return this.http.get<any>(environment.apiUrl+'/user/email/'+email);

  }

  getUserByFirstName(firstName: string): Observable<any> {
    return this.http.get<any>(environment.apiUrl+'/user/firstName/'+firstName);

  }

  getUserPinCode(id: any): Observable<any> {
    return this.http.get<number>(environment.apiUrl+'/user/pinCode/'+id);
  } 

  getIdByIdType(id: any, idType: any): Observable<any> {
    return this.http.get<string>(environment.apiUrl+"/user/"+id+"/"+idType);
  }

  getUsersByEntite(entite: number): Observable<any> {
    return this.http.get<any>(environment.apiUrl+'/user/entite/'+entite)
  }

  updateUser(id: number, user: User): Observable<any> {
    return this.http.put<any>(environment.apiUrl+'/user/updateUser/'+id, user)
  }

  blockOrUnblockUser(email: any, isBlocked: boolean): Observable<any> {
    return this.http.put<any>(environment.apiUrl+'/user/blockOrUnblockUser/'+email,  { blocked: isBlocked })
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(environment.apiUrl+'/user/deleteUser/'+id)
  }

}


