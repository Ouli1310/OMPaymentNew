import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProfilService {

  constructor(private http: HttpClient) { }

  getAllProfils(): Observable<any> {
    return this.http.get(environment.apiUrl+'/profil');
  }

  getProfilById(id: any): Observable<any>{
    return this.http.get<any>(environment.apiUrl+'/profil/'+id);
  } 
}
